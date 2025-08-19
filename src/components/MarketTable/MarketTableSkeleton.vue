<template>
  <tr v-for="_ in 10">
    <td><Shimmer :height="28" /></td>
    <td><Shimmer :height="28" /></td>
    <td><Shimmer :height="28" /></td>
    <td><Shimmer :height="28" /></td>
    <td><Shimmer :height="40" /></td>
  </tr>
</template>

<script setup lang="ts">
import Shimmer from '@/components/Common/Shimmer.vue';
</script>
