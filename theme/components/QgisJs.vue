<template>
  <div class="qgis">
    <div id="status">
      <div id="status-message">Initializing...</div>
      <div id="status-progress">
        <div class="lds-ellipsis">
          <div></div>
          <div></div>
          <div></div>
          <div></div>
        </div>
      </div>
    </div>
    <div ref="map" class="map" />
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, watchEffect } from "vue";

import { qgis } from "qgis-js";

import { QgisCanvasDataSource } from "@qgis-js/ol";

import { Map as OlMap, View } from "ol";

import ImageLayer from "ol/layer/Image";
import Projection from "ol/proj/Projection.js";

import GeoJSON from "ol/format/GeoJSON.js";
import { Vector as VectorSource } from "ol/source.js";
import { Vector as VectorLayer } from "ol/layer.js";

import { useGeographic } from "ol/proj.js";

import { context, setRuntime, setMap, setExtents } from "../../global-qgis";
import { interactions, globalInteractions } from "../../global-interactions";

import { cities } from "../../data/cities";

const map = ref(null);

function prefix() {
  return window.location.pathname.startsWith("/qgis-js-30daymapchallenge")
    ? "/qgis-js-30daymapchallenge/"
    : "/";
}

function project() {
  return prefix() + "qgis-js-30daymapchallenge-project";
}

function onEnter(slide: number) {
  globalInteractions.forEach((interaction) => {
    if (interaction.onEnter) {
      interaction.onEnter(context(), slide);
    }
  });
  if (interactions.onEnter.has(slide)) {
    interactions.onEnter.get(slide)!(context(), slide);
  }
}

function onLeave(slide: number) {
  globalInteractions.forEach((interaction) => {
    if (interaction.onLeave) {
      interaction.onLeave(context(), slide);
    }
  });
  if (interactions.onLeave.has(slide)) {
    interactions.onLeave.get(slide)!(context(), slide);
  }
}

const lastPage = ref(null);
watchEffect(() => {
  if (lastPage.value != $slidev.nav.currentPage) {
    if (lastPage.value) {
      onLeave(lastPage.value);
    }
    if ($slidev.nav.currentPage) {
      onEnter($slidev.nav.currentPage);
    }
  }
  lastPage.value = $slidev.nav.currentPage;
});

onMounted(async () => {
  const statusControl = document.getElementById("status")! as HTMLDivElement;

  let isError = false;
  const onStatus = (status: string) => {
    if (isError || !status) return;
    (statusControl.firstElementChild! as HTMLDivElement).innerHTML = status;
  };
  const onError = (error: Error | any) => {
    isError = true;
    console.error(error);
    const message =
      "" + error && error["message"] ? error["message"] : "Runtime error";
    //projectControl.style.visibility = "none";
    statusControl.style.display = "auto";
    statusControl.innerHTML = `<div class="alert alert-danger" role="alert">
      <b style="color: red">Error:&nbsp;</b>
      ${message}
    </div>`;
  };
  const onReady = () => {
    statusControl.firstElementChild!.innerHTML = "";
    statusControl.style.display = "none";
  };

  // boot the runtime
  const runtime = await qgis({
    prefix: prefix() + "assets/wasm",
    onStatus: (status: string) => {
      onStatus(status);
    },
  });
  setRuntime(runtime);
  const { api, fs } = runtime;

  onStatus("Downloading QGIS project...");

  // prepare the upload directory
  const uploadDir = "/upload";
  fs.mkdir(uploadDir);

  // fetch demo project and upload it to the runtime
  const source = project();
  const files = ["project.qgz", "data.gpkg", "map_georeferenced_clip.tif"];
  for (const file of files) {
    const url = `${source}/${file}`;
    const response = await fetch(url);
    const blob = await response.blob();
    const buffer = await blob.arrayBuffer();
    fs.writeFile(`${uploadDir}/${file}`, new Uint8Array(buffer));
  }

  // load the uploaded project
  api.loadProject(`${uploadDir}/${files[0]}`);

  // paint a first dummy frame
  onStatus("Rendering first frame...");
  await api.renderImage(api.srid(), api.fullExtent(), 42, 42, 1);

  onReady();

  // create the ol map with the projection from the project
  const projection = new Projection({
    code: api.srid(),
    units: "m",
  });

  const extents = new VectorSource({
    url: project() + "/extents.json",
    format: new GeoJSON(),
  });

  const vectorLayer = new VectorLayer({
    source: extents,
    style: {},
  });

  useGeographic();
  const ol = new OlMap({
    pixelRatio: 2,
    target: map.value! as HTMLDivElement,
    controls: [],
    layers: [
      new ImageLayer({
        source: new QgisCanvasDataSource(api, {
          projection,
        }),
      }),
      vectorLayer,
    ],
    view: new View({
      center: cities[0].coords,
      zoom: 5,
      projection,
    }),
  });

  setExtents(extents);
  setMap(ol);

  setTimeout(() => {
    if ($slidev.nav.currentPage && $slidev.nav.currentPage != 1) {
      onEnter($slidev.nav.currentPage);
    }
  }, 100);
});
</script>

<style scoped>
.qgis {
  opacity: 1;
}

.qgis,
.map {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: #2e4fb4;
}

#status {
  position: absolute;
  top: 0;
  right: 0;
  padding: 1em 1em 0 0;
  z-index: 1000000;
}

#status div {
  display: inline-block;
}

.lds-ellipsis {
  opacity: 0.75;
  display: inline-block;
  position: relative;
  width: 80px;
  height: 1em;
  margin-left: 0.5em;
  padding-top: 0.25em;
}
.lds-ellipsis div {
  position: absolute;
  width: 13px;
  height: 13px;
  border-radius: 50%;
  background: rgb(24, 24, 24);
  animation-timing-function: cubic-bezier(0, 1, 1, 0);
}
.lds-ellipsis div:nth-child(1) {
  left: 8px;
  animation: lds-ellipsis1 0.6s infinite;
}
.lds-ellipsis div:nth-child(2) {
  left: 8px;
  animation: lds-ellipsis2 0.6s infinite;
}
.lds-ellipsis div:nth-child(3) {
  left: 32px;
  animation: lds-ellipsis2 0.6s infinite;
}
.lds-ellipsis div:nth-child(4) {
  left: 56px;
  animation: lds-ellipsis3 0.6s infinite;
}
@keyframes lds-ellipsis1 {
  0% {
    transform: scale(0);
  }
  100% {
    transform: scale(1);
  }
}
@keyframes lds-ellipsis3 {
  0% {
    transform: scale(1);
  }
  100% {
    transform: scale(0);
  }
}
@keyframes lds-ellipsis2 {
  0% {
    transform: translate(0, 0);
  }
  100% {
    transform: translate(24px, 0);
  }
}
</style>
