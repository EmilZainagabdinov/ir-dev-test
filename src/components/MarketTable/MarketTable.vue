<template>
  <div class="tableWrapper">
    <table class="marketTable">
      <thead class="marketTableHead">
        <tr>
          <th class="coinHeader">Coin</th>
          <th class="priceHeader">Price</th>
          <th class="changeHeader">Change</th>
          <th v-if="!isSm" class="volumeHeader">Volume</th>
          <th v-if="isXl">Price chart</th>
        </tr>
      </thead>
      <tbody class="marketTableBody">
        <MarketTableSkeleton v-if="props.isFetching" />
        <MarketTablePlaceholder
          v-else-if="!props.isFetching && props.tradeList.length === 0"
          :no-filters="props.noActiveFilters"
        />
        <MarketTableRow v-else v-for="item in props.tradeList" :key="item.pair.primary" :trade-pair-data="item" />
      </tbody>
    </table>
  </div>
</template>

<script setup lang="ts">
import { TradePairData } from '@/stores/types.ts';
import { useBreakpoints } from '@/composables/useMediaQuery.ts';

const props = defineProps<{ tradeList: TradePairData[]; isFetching: boolean; noActiveFilters: boolean }>();

import MarketTableRow from './MarketTableRow.vue';
import MarketTableSkeleton from '@/components/MarketTable/MarketTableSkeleton.vue';
import MarketTablePlaceholder from '@/components/MarketTable/MarketTablePlaceholder.vue';

const { isSm, isXl } = useBreakpoints();
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
  text-align: left;
  @media (width < 1280px) {
    width: 20%;
  }
  @media (width < 1024px) {
    width: auto;
  }
}
.priceHeader {
  @media (width < 1280px) {
    text-align: right;
  }
}
.changeHeader {
  @media (width < 768px) {
    text-align: center;
  }
  @media (width < 480px) {
    text-align: right;
  }
}
.volumeHeader {
  @media (width < 1280px) {
    text-align: right;
  }
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
