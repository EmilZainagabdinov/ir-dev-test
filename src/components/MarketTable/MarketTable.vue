<template>
  <div class="tableWrapper">
    <table class="marketTable">
      <thead class="marketTableHead">
        <tr>
          <th class="coinHeader">
            <div class="sortableHeader">
              <SortSwitch :disabled="isFetching" :sort-key="SortColumns.NAME" v-model="activeSorting" />Coin
            </div>
          </th>
          <th class="priceHeader">
            <div class="sortableHeader">
              <SortSwitch :disabled="isFetching" :sort-key="SortColumns.PRICE" v-model="activeSorting" />Price
            </div>
          </th>
          <th class="changeHeader">
            <div class="sortableHeader">
              <SortSwitch :disabled="isFetching" :sort-key="SortColumns.PRICE_CHANGE" v-model="activeSorting" />Change
            </div>
          </th>
          <th v-if="!isSm" class="volumeHeader">
            <div class="sortableHeader">
              <SortSwitch :disabled="isFetching" :sort-key="SortColumns.VOLUME" v-model="activeSorting" />Volume
            </div>
          </th>
          <th v-if="isXl">Price chart</th>
        </tr>
      </thead>
      <tbody class="marketTableBody">
        <MarketTableSkeleton v-if="props.isFetching" />
        <MarketTablePlaceholder
          v-else-if="!props.isFetching && (sortedMarketList.length === 0 || props.error)"
          :no-filters="props.noActiveFilters"
          :error="props.error"
        >
          <template v-slot:actionBlock>
            <Button @click="props.refresh" :disabled="props.isFetching">
              <RotateCw :size="16" :strokeWidth="3" />
              Refresh
            </Button>
          </template>
        </MarketTablePlaceholder>
        <MarketTableRow v-else v-for="item in sortedMarketList" :key="item.pair.primary" :trade-pair-data="item" />
      </tbody>
    </table>
  </div>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue';
import { TradePairData } from '@/stores/types.ts';
import { useBreakpoints } from '@/composables/useMediaQuery.ts';
import MarketTableRow from './MarketTableRow.vue';
import MarketTableSkeleton from '@/components/MarketTable/MarketTableSkeleton.vue';
import MarketTablePlaceholder from '@/components/MarketTable/MarketTablePlaceholder.vue';
import SortSwitch from '@/components/MarketTable/SortSwitch.vue';
import { SortColumns, SortValue } from '@/components/MarketTable/types.ts';
import { marketDataSort } from '@/utils/marketDataSort.ts';
import { useCurrencyConfigStore } from '@/stores/currencyConfig.ts';
import { storeToRefs } from 'pinia';
import Button from '@/components/UI/Button.vue';
import { RotateCw } from 'lucide-vue-next';

const props = defineProps<{
  tradeList: TradePairData[];
  isFetching: boolean;
  noActiveFilters: boolean;
  error: boolean;
  refresh: () => void;
}>();
const currencyConfig = useCurrencyConfigStore();
const { tickersMap } = storeToRefs(currencyConfig);

const { isSm, isXl } = useBreakpoints();
const activeSorting = ref<SortValue | ''>('');

const sortedMarketList = computed(() => {
  let tradeListCopy = [...props.tradeList];

  if (activeSorting.value) {
    marketDataSort(activeSorting.value, tradeListCopy, tickersMap.value);
    return [...tradeListCopy];
  } else {
    return props.tradeList;
  }
});
</script>

<style scoped>
.tableWrapper {
  color: #1e1e1e;
  border: 1px solid #bebebe;
  border-radius: 16px;
  margin-top: 24px;
  @media (width < 1280px) {
    width: 100%;
  }
  @media (width < 768px) {
    margin-top: 16px;
  }
}
.marketTable {
  border-collapse: collapse;
  table-layout: fixed;
  white-space: nowrap;
  width: 100%;
  @media (width < 1024px) {
    font-size: 16px;
  }
  @media (width < 768px) {
    font-size: 14px;
  }
}
.marketTableHead {
  background-color: #dcdce1;
  color: #646469;

  & th {
    padding: 16px 32px;
    border-bottom: 1px solid #bebebe;
    @media (width < 1024px) {
      padding: 12px 18px;
    }
    @media (width < 768px) {
      padding: 12px;
    }
  }
  & th:first-child {
    border-top-left-radius: 16px;
  }
  & th:last-child {
    border-top-right-radius: 16px;
  }
}
.coinHeader {
  width: 400px;
  @media (width < 1280px) {
    width: 20%;
  }
  @media (width < 1024px) {
    width: auto;
  }
  & .sortableHeader {
    justify-self: flex-start;
  }
}
.priceHeader .sortableHeader {
  @media (width < 1280px) {
    justify-self: flex-end;
  }
}
.changeHeader .sortableHeader {
  @media (width < 480px) {
    justify-self: flex-end;
  }
}
.volumeHeader .sortableHeader {
  @media (width < 1280px) {
    justify-self: flex-end;
  }
}
.sortableHeader {
  display: flex;
  justify-self: center;
  align-items: center;
  gap: 4px;
}
</style>

<style>
.marketTableBody {
  background-color: #e6e6e6;
  & tr {
    cursor: pointer;
    &:hover {
      background-color: #ebebeb;
    }
  }
  & td {
    padding: 16px 32px;
    border-bottom: 1px solid #bebebe;
    font-weight: 550;
    @media (width < 1024px) {
      padding: 12px 18px;
    }
    @media (width < 768px) {
      padding: 12px;
    }
  }
  & tr:last-child td {
    border-bottom: none;

    &:first-child {
      border-bottom-left-radius: 16px;
    }
    &:last-child {
      border-bottom-right-radius: 16px;
    }
  }
}
</style>
