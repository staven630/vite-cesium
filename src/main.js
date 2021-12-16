import { createApp } from "vue";
import App from "./App.vue";
import router from "./router";
import "@/assets/scss/base.scss";
import "cesium/Build/Cesium/Widgets/widgets.css";

const app = createApp(App);
app.use(router);

app.mount("#app");
