<template>
  <tr>
    <td :colspan="colspan">
      <div class="placeholderContent" :class="{ placeholderContentError: error }">
        <CircleX v-if="error" :size="isSm ? 48 : 72" />
        <List v-else-if="noFilters" :size="isSm ? 48 : 72" />
        <SearchX v-else :size="isSm ? 48 : 72" />
        <span class="placeholderText">{{ placeholderText }}</span>
        <slot v-if="error" name="actionBlock" />
      </div>
    </td>
  </tr>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { SearchX, List, CircleX } from 'lucide-vue-next';

import { useBreakpoints } from '@/composables/useMediaQuery.ts';

const { noFilters, error } = defineProps<{ noFilters: boolean; error: boolean }>();

const { isSm, isLg } = useBreakpoints();
const placeholderText = computed(() => {
  if (!noFilters) return 'Try refining your search parameters';
  if (error) return 'Oops, something went wrong!';
  return 'Trade data not found';
});

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
  & svg {
    color: #3c3c3c;
  }
}
.placeholderContentError {
  & svg {
    color: #b40000;
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
