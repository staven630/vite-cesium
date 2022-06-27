const ROUTES = import.meta.glob('@/views/**/**.vue');
export const loadView = (name) => ROUTES[/* @vite-ignore */ `../views${name}.vue`];
