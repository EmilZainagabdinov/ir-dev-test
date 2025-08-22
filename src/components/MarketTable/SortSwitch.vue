<template>
  <button class="orderSwitchButton" :disabled="props.disabled" @click="cycleSortOrder">
    <ChevronDown :size="20" v-if="model === `${sortKey}_${SortOrder.DESC}`" />
    <ChevronUp :size="20" v-else-if="model === `${sortKey}_${SortOrder.ASC}`" />
    <ChevronsUpDown color="#a0a0a0" :size="20" v-else />
  </button>
</template>

<script setup lang="ts">
import { ChevronUp, ChevronDown, ChevronsUpDown } from 'lucide-vue-next';
import { SortOrder } from '@/components/MarketTable/types.ts';
import { ref } from 'vue';

const props = defineProps<{ sortKey: string; disabled: boolean }>();
const model = defineModel();

const sortOptions = ref(['', `${props.sortKey}_${SortOrder.DESC}`, `${props.sortKey}_${SortOrder.ASC}`]);
const currentIndex = ref(0);

const cycleSortOrder = () => {
  currentIndex.value = (currentIndex.value + 1) % sortOptions.value.length;
  model.value = sortOptions.value[currentIndex.value];
}
</script>

<style scoped>
.orderSwitchButton {
  all: unset;
  cursor: pointer;

  border-radius: 4px;
  & > svg {
    display: block;
  }
  &:hover {
    background-color: #c8c8cd;
  }
}
</style>
