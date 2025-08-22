<template>
  <Header />
  <main class="contentWrapper">
    <MarketTable />
  </main>
  <Footer />
</template>

<script setup>
import MarketTable from '@/components/MarketTable/MarketTable.vue';
import Header from '@/components/Header/Header.vue';
import Footer from '@/components/Footer/Footer.vue';
</script>
