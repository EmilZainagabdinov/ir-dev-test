import { createRouter, createWebHistory } from 'vue-router';

const Main = () => import('@/views/Main.vue');
const Dummy = () => import('@/views/DummyRouterPage.vue');

const routes = [
  { path: '/', name: 'Main Page', component: Main },
  { path: '/dummy', name: 'Dummy Page',  component: Dummy },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;
