<template>
  <tr>
    <td :colspan="colspan">
      <div class="placeholderContent">
        <List v-if="noFilters" :size="isSm ? 48 : 72" />
        <SearchX v-else :size="isSm ? 48 : 72" />
        <span class="placeholderText">{{
          noFilters ? 'Trade data not found' : 'Try refining your search parameters'
        }}</span>
      </div>
    </td>
  </tr>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { SearchX, List } from 'lucide-vue-next';

import { useBreakpoints } from '@/composables/useMediaQuery.ts';

const { noFilters } = defineProps<{ noFilters: boolean }>();

const { isSm, isLg } = useBreakpoints();

const colspan = computed(() => {
  if (isSm.value) {
    return 3;
  }
  if (isLg.value) {
    return 4;
  }
  return 5;
});
</script>

<style scoped>
.placeholderContent {
  display: flex;
  flex-direction: column;
  gap: 8px;
  align-items: center;
  justify-content: center;
  padding: 160px 0;
  color: #3c3c3c;
  @media (width < 1024px) {
    padding: 128px 0;
  }
  @media (width < 768px) {
    padding: 96px 0;
  }
  & svg * {
    stroke: #3c3c3c;
  }
}
.placeholderText {
  font-size: 24px;
  max-width: 30%;
  white-space: break-spaces;
  text-align: center;
  @media (width < 1024px) {
    max-width: 40%;
  }
  @media (width < 768px) {
    max-width: 60%;
    font-size: 18px;
  }
  @media (width < 480px) {
    max-width: 65%;
  }
}
</style>
