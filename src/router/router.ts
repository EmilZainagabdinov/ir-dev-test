import { createRouter, createWebHistory } from 'vue-router';

import MarketTable from '@/components/MarketTable/MarketTable.vue';
import Dummy from '@/views/DummyRouterPage.vue';

const routes = [
  { path: '/', component: MarketTable },
  { path: '/dummy', component: Dummy },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;
