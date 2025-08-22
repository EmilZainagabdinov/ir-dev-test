<template>
  <header class="header contentWrapperFullWidth" :class="{ burgerOpen: isBurgerMenuOpen }">
    <nav class="headerBlock navBlock">
      <RouterLink to="/" class="headerTitleLogo">
        <BadgeDollarSign style="display: block" v-if="isMd" :size="48" />
        <template v-else>Name/Logo</template>
      </RouterLink>
      <template v-if="!isSm">
        <RouterLink to="/dummy" class="navLink">Nav Link</RouterLink>
        <RouterLink to="/dummy" class="navLink">Another Link</RouterLink>
        <RouterLink to="/dummy" class="navLink">One More Link</RouterLink>
      </template>
    </nav>
    <div v-if="!isSm" class="headerBlock actionBlock">
      <Button> Sign in </Button>
      <Button> Register </Button>
    </div>
    <button v-else class="burgerButton" @click="isBurgerMenuOpen = !isBurgerMenuOpen">
      <Menu :size="36" />
    </button>
    <Transition v-if="isBurgerMenuOpen">
      <nav class="burgerNavigation">
        <RouterLink to="/dummy" class="navLink">Nav Link</RouterLink>
        <RouterLink to="/dummy" class="navLink">Another Link</RouterLink>
        <RouterLink to="/dummy" class="navLink">One More Link</RouterLink>
        <Button size="md"> Sign in </Button>
        <Button size="md"> Register </Button>
      </nav>
    </Transition>
  </header>
</template>

<script setup lang="ts">
import { BadgeDollarSign, Menu } from 'lucide-vue-next';
import Button from '@/components/UI/Button.vue';
import { useBreakpoints } from '@/composables/useMediaQuery.ts';
import { onUnmounted, ref, watch } from 'vue';
import { useBlockScroll } from '@/composables/useBlockScroll.ts';

const { isSm, isMd } = useBreakpoints();
const isBurgerMenuOpen = ref(false);
const { blockScroll, releaseScroll} = useBlockScroll();

watch(isBurgerMenuOpen, () => {
  if (isBurgerMenuOpen.value) {
    blockScroll();
  } else {
    releaseScroll();
  }
});

onUnmounted(() => {
  releaseScroll();
});
</script>

<style scoped>
.header {
  height: 96px;
  background-color: #232d49;
  display: flex;
  justify-content: space-between;
  align-items: center;
  transition: height 200ms ease-in-out;
  @media (width < 768px) {
    display: grid;
    width: 100%;
    grid-template:
      'nav action' 96px
      'menu menu' auto;
    & .navBlock {
      grid-area: nav;
      justify-self: start;
    }
    & .burgerButton {
      grid-area: action;
      justify-self: end;
    }
  }
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
  white-space: nowrap;
}
.navBlock {
  gap: 32px;
  @media (width < 1024px) {
    gap: 24px;
  }
}
.actionBlock {
  gap: 16px;
}
.navLink {
  color: #bebebe;
  text-decoration: none;
  margin-top: 3px;
  @media (width < 1024px) {
    margin-top: 0;
  }
  &:hover {
    color: #e6e6e6;
    text-decoration: underline;
  }
}
.burgerButton {
  all: unset;
  padding: 4px;
  border-radius: 8px;
  cursor: pointer;
  & > svg {
    display: block;
    color: #f5f5f5;
  }
  &:hover {
    background-color: rgba(245, 245, 245, 0.15);
  }
  &:active {
    background-color: rgba(245, 245, 245, 0.3);
  }
}
.burgerOpen {
  height: 100vh;
  & .burgerNavigation {
    grid-area: menu;
    align-self: start;
    justify-self: center;
    display: flex;
    flex-direction: column;
    gap: 64px;
    align-items: center;
    font-size: 24px;
  }
}
</style>
