<template>
  <button class="button">
    <slot />
  </button>
</template>

<script setup lang="ts">

</script>

<style scoped>
.button {
  border: unset;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 8px;
  height: 36px;
  border-radius: 8px;
  padding: 0 16px;
  font-size: 16px;
  font-weight: bold;
  color: #2d2d2d;
  background-color: #dcdcdc;
  &:hover {
    background-color: #e6e6e6;
  }
  &:active {
    outline: 2px solid #f5f5f5;
    outline-offset: 2px;
  }
}
</style>