<template>
  <div class="shimmer" />
</template>

<script setup lang="ts">
const { height = 16, width = 100 } = defineProps<{ height?: number; width?: number }>();
</script>

<style scoped>
@keyframes shimmer {
  100% {
    transform: translateX(100%);
  }
}

.shimmer {
  height: v-bind(height + 'px');
  width: v-bind(width + '%');
  border-radius: 8px;
  background-color: #c8c8c8;
  overflow: hidden;
  position: relative;
  &::before {
    content: '';
    position: absolute;
    width: 100%;
    height: 100%;
    background-image: linear-gradient(to right, transparent, #dcdcdc, transparent);
    transform: translateX(-100%);
    animation: shimmer 2s infinite;
  }
}
</style>
