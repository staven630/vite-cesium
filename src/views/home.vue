<template>
  <div id="cesiumContainer" ref="cesiumRef"></div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import * as Cesium from "cesium";

const cesiumRef = ref(null);
onMounted(() => {
  const viewer = new Cesium.Viewer(cesiumRef.value, {
    // terrainProvider: Cesium.createWorldTerrain(),
  });
  // Cesium.Ion.defaultAccessToken = import.meta.env.VITE_CESIUM_ACCESS_TOKEN;
  // 启用光照
  viewer.scene.globe.enableLighting = true;
  viewer.cesiumWidget.creditContainer.style.display = "none";
  // 取消双击事件
  viewer.cesiumWidget.screenSpaceEventHandler.removeInputAction(
    Cesium.ScreenSpaceEventType.LEFT_DOUBLE_CLICK
  );

  const tileset = viewer.scene.primitives.add(
    new Cesium.Cesium3DTileset({
      url: 'http://112.30.112.43:8082/Data/qx-hfdxy/tileset.json'
    })
  );

  tileset.readyPromise.then(function (tileset) {
    viewer.flyTo(tileset)
  })
});
</script>

<style lang="less" scoped>
#cesiumContainer  {
  width: 100vw;
  height: 100vh;
}
</style>
