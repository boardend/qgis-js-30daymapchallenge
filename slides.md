---
theme: ./theme
fonts:
  provider: "none"
class: text-center
highlighter: shiki
lineNumbers: false
drawings:
  persist: false
transition: slide-left
title: qgis-js - QGIS core ported to WebAssembly to run it on the web platform
mdc: true
hideInToc: true
---

<div class="pt-12 rounded-xl bg-white bg-opacity-85">
<h1>QGIS-JS</h1>
<h2><b>QGIS core ported to WebAssembly <br />to run it on the web platform</b></h2>
<br />
  <span @click="$slidev.nav.next">
    <h3 style="padding-bottom: 0.5em"><a href="https://github.com/boardend" target="_blank">Michael Schmuki</a>, <a href="https://opengis.ch/" target="_blank">OPENGIS.ch</a></h3>
    <h3>QGIS User Conference 2024 @ Bratislava</h3>
  </span>
  <br /><br />
</div>

<div class="abs-br m-6 flex gap-2">
  <a href="https://github.com/boardend/qgis-js-30daymapchallenge" target="_blank" alt="GitHub" title="Open in GitHub"
    class="text-xl slidev-icon-btn opacity-50 !border-none !hover:text-white">
    <carbon-logo-github />
  </a>
</div>

<!--
The last comment block of each slide will be treated as slide notes. It will be visible and editable in Presenter Mode along with the slide. [Read more in the docs](https://sli.dev/guide/syntax.html#notes)
-->

---
layout: image-right
image:
hideInToc: true
---

# Content

<Toc maxDepth="1"></Toc>

---
src: ./pages/03-intro.md
---

---
src: ./pages/04-qgis-js.md
---

---
src: ./pages/05-webassembly.md
---

---
src: ./pages/06-architektur.md
---

---
src: ./pages/07-features.md
---

---
src: ./pages/08-features-symbols.md
---

---
src: ./pages/09-features-rasters.md
---

---
src: ./pages/10-features-labels.md
---

---
src: ./pages/11-features-diagrams.md
---

---
src: ./pages/12-demo.md
---

---
src: ./pages/13-potential.md
---

---
src: ./pages/14-limitation.md
---

---
src: ./pages/15-licence.md
---

---
src: ./pages/16-future.md
---

---
routeAlias: thanks
layout: center
class: text-center
hideInToc: true
---

# Many Thanks for Your Attention!

<a href="https://github.com/boardend" target="_blank">Michael Schmuki</a>, michael@opengis.ch

<br />

**qgis-js** Website: [https://qgis.github.io/qgis-js](https://qgis.github.io/qgis-js/)

**qgis-js** on GitHub: [https://github.com/qgis/qgis-js](https://github.com/qgis/qgis-js)

**qgis-js** on npm: [https://www.npmjs.com/package/qgis-js](https://www.npmjs.com/package/qgis-js)

<br /><br />

**Interactive Slides**: [https://boardend.github.io/qgis-js-30daymapchallenge](https://boardend.github.io/qgis-js-30daymapchallenge/)
