<template>
  <header class="header contentWrapperFullWidth">
    <nav class="headerBlock navBlock">
      <RouterLink to="/" class="headerTitleLogo">
        Name/Logo
      </RouterLink>
      <RouterLink to="/dummy" class="navLink">Nav Link</RouterLink>
      <RouterLink to="/dummy" class="navLink">Another Link</RouterLink>
      <RouterLink to="/dummy" class="navLink">One More Link</RouterLink>
    </nav>
    <div class="headerBlock actionBlock">
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
.headerTitleLogo {
  color: #f5f5f5;
  font-weight: 600;
  font-size: 24px;
  text-decoration: none;
}
.headerBlock {
  display: flex;
  align-items: center;
}
.navBlock {
  gap: 32px;
}
.actionBlock {
  gap: 16px;
}
.navLink {
  color: #bebebe;
  text-decoration: none;
  margin-top: 3px;
  &:hover {
    color: #e6e6e6;
  }
}
</style>