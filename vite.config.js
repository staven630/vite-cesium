import { defineConfig, loadEnv } from "vite";
import vue from "@vitejs/plugin-vue";
import vueJsx from "@vitejs/plugin-vue-jsx";
import vueSetupExtend from "vite-plugin-vue-setup-extend";
import commonjsExternals from "vite-plugin-commonjs-externals";
import externalGlobals from "rollup-plugin-external-globals";

import { parseEnv, parseProxy, buildConfig, visualizer } from "./scripts/vite/index";

import path from "path";
import fse from "fs-extra";
const nodeResolve = (dir) => path.resolve(__dirname, dir);

const CESIUM_PATH = "cesium";

if (!fse.existsSync(`public/cesium`)) {
  ["Workers", "Assets", "ThirdParty", "Widgets"].forEach((item) => {
    fse.copySync(`./node_modules/cesium/Source/${item}`, `public/${CESIUM_PATH}/${item}`);
  });
  fse.copySync(`./node_modules/cesium/Build/Cesium/Cesium.js`, `public/${CESIUM_PATH}/Cesium.js`);
}

export default ({ mode }) => {
  const env = parseEnv(loadEnv(mode, process.cwd(), ""));
  const IS_PROD = ["prod", "production"].includes(env.NODE_ENV);

  let plugins = [
    vue(),
    vueJsx(),
    vueSetupExtend(),
    commonjsExternals({
      externals: ["path"],
    }),
  ];

  const resolve = {
    alias: {
      "@": nodeResolve("src"),
      "~": nodeResolve("public"),
    },
  };

  const css = {
    preprocessorOptions: {
      less: {
        additionalData: '@import "@/assets/less/variables.less";',
        javascriptEnabled: true,
      },
    },
  };

  const esbuild = {
    pure: env.VITE_DROP_CONSOLE ? ["console.log", "debugger"] : [],
  };

  const server = {
    host: "127.0.0.1",
    port: env.VITE_PORT || 3000,
    proxy: parseProxy(env.VITE_PROXY),
  };

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

  let cesiumBaseUrl = env.CESIUM_BASE_URL;

  if (!cesiumBaseUrl) {
    cesiumBaseUrl = IS_PROD ? "./" : `http://${server.host}:${server.port}`;
  }

  const define = {
    CESIUM_BASE_URL: JSON.stringify(`${cesiumBaseUrl}/${CESIUM_PATH}`),
  };

  if (IS_PROD) {
    plugins.push(visualizer());
  }

  return defineConfig({
    build,
    css,
    define,
    esbuild,
    resolve,
    plugins,
    server,
  });
};
