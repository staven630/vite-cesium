import { loadEnv } from "vite";
import vue from "@vitejs/plugin-vue";
import copy from "rollup-plugin-copy";
import vueJsx from "@vitejs/plugin-vue-jsx";
import vueSetupExtend from "vite-plugin-vue-setup-extend";
import commonjsExternals from "vite-plugin-commonjs-externals";
import Components from "unplugin-vue-components/vite";
import { ElementPlusResolver } from "unplugin-vue-components/resolvers";
import ElementPlus from "unplugin-element-plus/vite";
import importToCDN from "vite-plugin-cdn-import";
import { visualizer } from "rollup-plugin-visualizer";

import * as path from "path";
import fse from "fs-extra";

const nodeResolve = (dir) => path.resolve(__dirname, ".", dir);

const CESIUM_PATH = "cesium";

const server = {
  host: "127.0.0.1",
  port: "3000",
};

const cesiumCopy = () => {
  const targets = ["Workers", "Assets", "ThirdParty", "Widgets"].map((item) => {
    return {
      src: `./node_modules/cesium/Source/${item}/**/*`,
      dest: `public/${CESIUM_PATH}/${item}`,
    };
  });

  return copy({ targets });
};

// https://vitejs.dev/config/
export default (config) => {
  const { mode } = config;

  process.env = {
    ...process.env,
    ...loadEnv(mode, process.cwd()),
  };

  const IS_PROD = ["prod", "production"].includes(mode);

  let base = process.env.CESIUM_BASE_URL;

  if (!base) {
    base = IS_PROD ? "./" : `http://${server.host}:${server.port}`;
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
    CESIUM_BASE_URL: JSON.stringify(`${base}/${CESIUM_PATH}`),
  };

  if (!fse.existsSync(`public/${CESIUM_PATH}`)) {
    plugins.push(cesiumCopy());
  }

  if (IS_PROD) {
    plugins = [
      ...plugins,
      importToCDN({
        modules: [
          {
            name: "cesium",
            var: "Cesium",
            path: "https://cdn.bootcdn.net/ajax/libs/cesium/1.83.0/Cesium.js",
            css: "https://cdn.bootcdn.net/ajax/libs/cesium/1.83.0/Widgets/widgets.min.css",
            // path: `https://cesium.com/downloads/cesiumjs/releases/1.88/Build/Cesium/Cesium.js`,
            // css: "https://cesium.com/downloads/cesiumjs/releases/1.88/Build/Cesium/Widgets/widgets.css",
          },
        ],
      }),
      visualizer(),
    ];
  }

  return {
    base,
    define,
    resolve,
    plugins,
    server,
  };
};
