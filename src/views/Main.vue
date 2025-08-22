<template>
  <div class="filtersBar">
    <Select v-model="filter" :options="filterOptions" placeholder="Select filter..." :width="isSm ? '100%' : '200px'" />
    <Input
      id="marketTableSearch"
      v-model="search"
      :icon="Search"
      placeholder="Search..."
      :width="isSm ? '100%' : '300px'"
    />
  </div>
  <MarketTable :trade-list="filteredMarketList" :is-fetching="isFetching" :no-active-filters="noActiveFilters" />
</template>

<script setup lang="ts">
import { Search } from 'lucide-vue-next';
import Input from '@/components/UI/Input.vue';
import Select from '@/components/UI/Select.vue';
import { SelectOptions } from '@/components/UI/types.ts';
import { PriceChangeEnum, TradePairData } from '@/stores/types.ts';
import { computed, onMounted, onUnmounted, ref, watch } from 'vue';
import { useCurrencyConfigStore } from '@/stores/currencyConfig.ts';
import { useMarketDataStore } from '@/stores/marketData.ts';
import { useWindowFocus, watchDebounced } from '@vueuse/core';
import { storeToRefs } from 'pinia';
import { useBreakpoints } from '@/composables/useMediaQuery.ts';
import MarketTable from '@/components/MarketTable/MarketTable.vue';

const currencyConfig = useCurrencyConfigStore();
const marketData = useMarketDataStore();
const { data: marketDataList } = storeToRefs(marketData);
const { isSm } = useBreakpoints();

const filterOptions: SelectOptions[] = [
  { label: 'Gaining', value: PriceChangeEnum.UP },
  { label: 'Losing', value: PriceChangeEnum.DOWN },
];
const search = ref('');
const debouncedSearch = ref('');
const filter = ref('');
const filteredMarketList = ref<TradePairData[]>([]);

const tabFocused = useWindowFocus();
let pollingInterval: ReturnType<typeof setTimeout>;

watchDebounced(
  search,
  () => {
    debouncedSearch.value = search.value.trim().toLowerCase();
  },
  { debounce: 500 },
);

const isFetching = computed(() => currencyConfig.initialFetch || marketData.initialFetch);
const noActiveFilters = computed(() => !debouncedSearch.value && !filter.value);

const { stop: stopFilterWatch } = watch([marketDataList, filter, debouncedSearch], () => {
  let marketListCopy = [...marketDataList.value];

  if (debouncedSearch.value) {
    marketListCopy = marketListCopy.filter(
      (tradePair) =>
        tradePair.pair.primary.toLowerCase().includes(debouncedSearch.value) ||
        currencyConfig.tickersMap?.[tradePair.pair.primary]?.ticker.toLowerCase().includes(debouncedSearch.value),
    );
  }

  if (filter.value) {
    marketListCopy = marketListCopy.filter((tradePair) => tradePair.price.change.direction === filter.value);
  }

  filteredMarketList.value = [...marketListCopy];
});

onMounted(() => {
  currencyConfig.fetchCurrencyConfig();
  marketData.fetchMarketData();

  pollingInterval = setInterval(() => {
    if (tabFocused.value) {
      currencyConfig.fetchCurrencyConfig();
      marketData.fetchMarketData();
    }
  }, 5000);
});

onUnmounted(() => {
  if (pollingInterval) {
    clearInterval(pollingInterval);
  }
  stopFilterWatch();
  marketData.$reset();
  currencyConfig.$reset();
});
</script>

<style scoped>
.filtersBar {
  display: flex;
  justify-content: flex-end;
  align-items: center;
  gap: 16px;
  @media (width < 768px) {
    flex-direction: column;
    gap: 12px;
  }
}
</style>