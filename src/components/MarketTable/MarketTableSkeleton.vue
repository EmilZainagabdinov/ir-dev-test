<template>
  <tr v-for="_ in 10">
    <td>
      <Shimmer :height="isMd ? 24 : 28" />
    </td>
    <td>
      <Shimmer :height="isMd ? 24 : 28" />
    </td>
    <td>
      <Shimmer :height="isMd ? 24 : 28" />
    </td>
    <td v-if="!isSm">
      <Shimmer :height="isMd ? 24 : 28" />
    </td>
    <td v-if="isXl">
      <Shimmer :height="40" />
    </td>
  </tr>
</template>

<script setup lang="ts">
import Shimmer from '@/components/UI/Shimmer.vue';
import { useBreakpoints } from '@/composables/useMediaQuery.ts';

const { isSm, isMd, isXl } = useBreakpoints();
</script>
