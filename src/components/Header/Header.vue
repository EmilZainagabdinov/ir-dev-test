<template>
  <header class="header contentWrapperFullWidth">
    <span class="headerTitle">
      Name Here
    </span>
    <div class="actionBox">
      <Button>
        Sign in
      </Button>
      <Button>
        Register
      </Button>
    </div>
  </header>
</template>

<script setup lang="ts">
import Button from '@/components/UI/Button.vue';
</script>

<style scoped>
.header {
  height: 96px;
  background-color: #232d49;
  display: flex;
  justify-content: space-between;
  align-items: center;
}
.headerTitle {
  color: #f5f5f5;
  font-weight: 600;
  font-size: 24px;
}
.actionBox {
  display: flex;
  gap: 16px;
}
</style>