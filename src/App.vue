<template>
  <Header />
  <main class="contentWrapper">
    <MarketTable />
  </main>
  <footer>footer here...</footer>
</template>

<script setup>
import MarketTable from '@/components/MarketTable/MarketTable.vue';
import Header from '@/components/Header/Header.vue';
</script>
