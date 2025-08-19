<template>
  <tr class="marketTableRow">
    <td>
      <div class="coinCell">
        <img v-if="hasImage" :src="icon" :alt="`${coinTicker} icon`" height="24" width="24"/>
        <div v-else class="noImageWrapper">
          <ImageOff :size="20" />
        </div>
        {{ coinTicker }}
      </div>
    </td>
    <td class="currencyValue">$ {{ lastPrice }}</td>
    <td>
      <div class="priceChange">
        <span class="percentageChange" :class="isPositiveChange ? 'positiveChange' : 'negativeChange'"
          >{{ tradePairData.price.change.percent }}%</span
        >
        <span class="amountChange" :class="isPositiveChange ? 'positiveChange' : 'negativeChange'">{{
          priceChangeAmount
        }}</span>
      </div>
    </td>
    <td class="currencyValue">$ {{ volumeValue }}</td>
    <td>
      <LineChart :dataset="chartDataset" />
    </td>
  </tr>
</template>

<script setup lang="ts">
import { useCurrencyConfigStore } from '@/stores/currencyConfig.ts';
import { PriceChangeEnum, TradePairData } from '@/stores/types.ts';
import { ImageOff } from 'lucide-vue-next';

import LineChart from '@/components/MarketTable/LineChart.vue';
import { reactive } from 'vue';

const props = defineProps<{ tradePairData: TradePairData }>();

const { tickersMap } = useCurrencyConfigStore();
const chartDataset = reactive(
  props.tradePairData.priceHistory.map((item) => {
    return parseFloat(item);
  }),
);

const hasImage = tickersMap?.[props.tradePairData.pair.primary]?.icon;
const icon = `data:image/svg+xml;base64,${tickersMap?.[props.tradePairData.pair.primary]?.icon}`;

const coinTicker = tickersMap?.[props.tradePairData.pair.primary]?.ticker || props.tradePairData.pair.primary;
const lastPrice = parseFloat(props.tradePairData.price.last).toLocaleString([], {
  maximumFractionDigits: tickersMap?.[props.tradePairData.pair.primary]?.fractionDigits || 5,
});
const priceChangeAmount = parseFloat(props.tradePairData.price.change.amount).toFixed(2);
const volumeValue = parseFloat(props.tradePairData.volume.secondary).toLocaleString([], { maximumFractionDigits: 2 });

const isPositiveChange = props.tradePairData.price.change.direction === PriceChangeEnum.UP;
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
