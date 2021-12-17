<template>
  <div id="cesiumContainer" ref="cesiumRef"></div>
</template>

<script setup name="home">
import { ref, onMounted } from "vue";
import * as Cesium from "cesium";

const cesiumRef = ref(null);

onMounted(() => {
  const viewer = new Cesium.Viewer(cesiumRef.value, {
    terrainProvider: Cesium.createWorldTerrain(),
  });

  Cesium.Ion.defaultAccessToken = import.meta.env.VITE_CESIUM_ACCESS_TOKEN;

  // 启用光照
  viewer.scene.globe.enableLighting = true;

  viewer.cesiumWidget.creditContainer.style.display = "none";
  // 取消双击事件
  viewer.cesiumWidget.screenSpaceEventHandler.removeInputAction(
    Cesium.ScreenSpaceEventType.LEFT_DOUBLE_CLICK
  );
});
</script>

<style lang="scss" scoped>
#cesiumContainer {
  width: 100%;
  height: 100%;
  overflow: hidden;
}
</style>
