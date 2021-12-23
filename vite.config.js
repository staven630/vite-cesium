import { loadEnv } from "vite";
import vue from "@vitejs/plugin-vue";
import vueJsx from "@vitejs/plugin-vue-jsx";
import vueSetupExtend from "vite-plugin-vue-setup-extend";
import commonjsExternals from "vite-plugin-commonjs-externals";
import Components from "unplugin-vue-components/vite";
import { ElementPlusResolver } from "unplugin-vue-components/resolvers";
import ElementPlus from "unplugin-element-plus/vite";
import { visualizer } from "rollup-plugin-visualizer";
import externalGlobals from "rollup-plugin-external-globals";

import * as path from "path";
import fse from "fs-extra";

const nodeResolve = (dir) => path.resolve(__dirname, ".", dir);

const CESIUM_PATH = "cesium";

const server = {
  host: "127.0.0.1",
  port: "3000",
};

if (!fse.existsSync(`public/cesium`)) {
  ["Workers", "Assets", "ThirdParty", "Widgets"].forEach((item) => {
    fse.copySync(
      `./node_modules/cesium/Source/${item}`,
      `public/${CESIUM_PATH}/${item}`
    );
  });
  fse.copySync(
    `./node_modules/cesium/Build/Cesium/Cesium.js`,
    `public/${CESIUM_PATH}/Cesium.js`
  );
}

// https://vitejs.dev/config/
export default (config) => {
  const { mode } = config;

  process.env = {
    ...process.env,
    ...loadEnv(mode, process.cwd()),
  };

  const IS_PROD = ["prod", "production"].includes(mode);

  let cesiumBaseUrl = process.env.CESIUM_BASE_URL;

  if (!cesiumBaseUrl) {
    cesiumBaseUrl = IS_PROD ? "./" : `http://${server.host}:${server.port}`;
  }

  const resolve = {
    alias: {
      "@": nodeResolve("src"),
      "~": nodeResolve("~"),
    },
  };

  let plugins = [
    vue(),
    vueJsx(),
    vueSetupExtend(),
    commonjsExternals({
      externals: ["path"],
    }),
    Components({
      resolvers: [ElementPlusResolver()],
    }),
    ElementPlus({}),
  ];

  const define = {
    CESIUM_BASE_URL: JSON.stringify(`${cesiumBaseUrl}/${CESIUM_PATH}`),
  };

  if (IS_PROD) {
    plugins = [...plugins, visualizer()];
  }

  const build = {
    rollupOptions: {
      external: ["cesium"],
      plugins: [
        externalGlobals({
          cesium: "Cesium",
        }),
      ],
    },
  };

  return {
    define,
    resolve,
    plugins,
    server,
    build,
  };
};
