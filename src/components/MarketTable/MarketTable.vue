<template>
  <div class="tableWrapper">
    <table class="marketTable">
      <thead class="marketTableHead">
        <tr>
          <th class="coinHeader">Coin</th>
          <th>Price</th>
          <th>Change</th>
          <th>Volume</th>
          <th>Price chart</th>
        </tr>
      </thead>
      <tbody class="marketTableBody">
                <MarketTableRow
                  v-if="!isFetching"
                  v-for="item in marketData.data"
                  :key="item.pair.primary"
                  :trade-pair-data="item"
                />
                <MarketTableSkeleton v-else />
      </tbody>
    </table>
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted } from 'vue';
import { useCurrencyConfigStore } from '@/stores/currencyConfig.ts';
import { useMarketDataStore } from '@/stores/marketData.ts';

import MarketTableRow from './MarketTableRow.vue';
import MarketTableSkeleton from '@/components/MarketTable/MarketTableSkeleton.vue';

const currencyConfig = useCurrencyConfigStore();
const marketData = useMarketDataStore();

const isFetching = computed(() => currencyConfig.isFetching || marketData.isFetching);

onMounted(() => {
  currencyConfig.fetchCurrencyConfig();
  marketData.fetchMarketData();
});
</script>

<style scoped>
.tableWrapper {
  margin: 48px auto;
  color: #1e1e1e;
  width: max-content;
  border: 1px solid #bebebe;
  border-radius: 16px;
}
.marketTable {
  border-collapse: collapse;
  table-layout: fixed;
  width: 1200px;
}
.marketTableHead {
  background-color: #dcdce1;
  color: #646469;

  & th {
    padding: 16px 32px;
    border-bottom: 1px solid #bebebe;
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
  text-align: left;
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
