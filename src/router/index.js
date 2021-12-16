import { createRouter, createWebHistory } from "vue-router";

const modules = import.meta.glob("../views/**/**.vue");

const loadView = (name) => modules[/* @vite-ignore */ `../views${name}.vue`];

const routes = [
  {
    path: "/",
    component: loadView("/home/index"),
  },
  {
    path: "/:pathMatch(.*)",
    redirect: "/404",
  },
];

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
});

export default router;
