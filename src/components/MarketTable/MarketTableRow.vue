<template>
  <tr class="marketTableRow">
    <td>
      <div class="coinCell">
        <img v-if="hasImage" :src="icon" :alt="`${coinTicker} icon`" height="24" width="24" />
        <div v-else class="noImageWrapper">
          <ImageOff :size="20" />
        </div>
        {{ tradePairData.pair.primary }}
      </div>
    </td>
    <td class="currencyValue">$ {{ lastPrice }}</td>
    <td>
      <div class="priceChange">
        <span class="percentageChange" :class="isPositiveChange ? 'positiveChange' : 'negativeChange'"
          >{{ props.tradePairData.price.change.percent }}%</span
        >
        <span class="amountChange" :class="isPositiveChange ? 'positiveChange' : 'negativeChange'">{{
          priceChangeAmount
        }}</span>
      </div>
    </td>
    <td v-if="!isSm" class="currencyValue">$ {{ volumeValue }}</td>
    <td v-if="isXl">
      <LineChart :dataset="chartDataset" />
    </td>
  </tr>
</template>

<script setup lang="ts">
import { ImageOff } from 'lucide-vue-next';
import { useCurrencyConfigStore } from '@/stores/currencyConfig.ts';
import { PriceChangeEnum, TradePairData } from '@/stores/types.ts';
import { useBreakpoints } from '@/composables/useMediaQuery.ts';
import LineChart from '@/components/MarketTable/LineChart.vue';
import { computed } from 'vue';
import { storeToRefs } from 'pinia';

const props = defineProps<{ tradePairData: TradePairData }>();

const { isSm, isXl } = useBreakpoints();
const currencyConfig = useCurrencyConfigStore();
const { tickersMap } = storeToRefs(currencyConfig);

const chartDataset = computed(() => {
  return props.tradePairData.priceHistory.map((item) => {
    return parseFloat(item);
  });
});

const hasImage = computed(() => tickersMap.value?.[props.tradePairData.pair.primary]?.icon);
const icon = computed(() => `data:image/svg+xml;base64,${tickersMap.value?.[props.tradePairData.pair.primary]?.icon}`);

const coinTicker = computed(
  () => tickersMap.value?.[props.tradePairData.pair.primary]?.ticker || props.tradePairData.pair.primary,
);
const lastPrice = computed(() =>
  parseFloat(props.tradePairData.price.last).toLocaleString([], {
    maximumFractionDigits: tickersMap.value?.[props.tradePairData.pair.primary]?.fractionDigits || 5,
  }),
);
const priceChangeAmount = computed(() => parseFloat(props.tradePairData.price.change.amount).toFixed(2));
const volumeValue = computed(() =>
  parseFloat(props.tradePairData.volume.secondary).toLocaleString([], { maximumFractionDigits: 2 }),
);

const isPositiveChange = computed(() => props.tradePairData.price.change.direction === PriceChangeEnum.UP);
</script>

<style scoped>
.coinCell {
  display: flex;
  align-items: center;
  gap: 8px;
  text-transform: uppercase;
}
.currencyValue {
  text-align: right;
}
.priceChange {
  color: #646464;
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  align-items: center;
  gap: 16px;
  text-align: right;
  font-weight: 500;
  @media (width < 1024px) {
    gap: 8px;
  }
  @media (width < 480px) {
    grid-template-columns: 1fr;
  }
}
.amountChange {
  @media (width < 480px) {
    display: none;
  }
}
.positiveChange {
  &:not(.amountChange) {
    color: #008000;
  }
  &::before {
    content: '+';
  }
}
.negativeChange {
  &:not(.amountChange) {
    color: #b40000;
  }
  &::before {
    content: '-';
  }
}
.noImageWrapper {
  height: 24px;
  aspect-ratio: 1;
  border-radius: 4px;
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: #c8c8c8;
  & svg {
    stroke: #3c3c3c;
  }
}
</style>
