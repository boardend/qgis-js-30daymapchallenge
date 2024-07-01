import { normalizePath } from "vite";
import path from "node:path";

import { defineConfig } from "vite";

import { viteStaticCopy } from "vite-plugin-static-copy";

const headers = {
  "Cross-Origin-Opener-Policy": "same-origin",
  "Cross-Origin-Embedder-Policy": "require-corp",
};

export default defineConfig({
  build: {
    target: "esnext",
  },
  optimizeDeps: {
    exclude: ["public/projects"],
  },
  plugins: [
    {
      name: "headers-after-static-copy",
      configureServer(server) {
        server.middlewares.use((_req, res, next) => {
          Object.entries(headers).forEach(([key, value]) => {
            res.setHeader(key, value);
          });
          next();
        });
      },
    },
    viteStaticCopy({
      silent: false,
      targets: [
        {
          src:
            normalizePath(
              path.resolve(__dirname, "node_modules/qgis-js/dist/assets/wasm"),
            ) + "/**",
          dest: "assets/wasm",
        },
      ],
    }),
    viteStaticCopy({
      targets: [
        {
          src: normalizePath(
            path.resolve(
              __dirname,
              "./node_modules/coi-serviceworker/coi-serviceworker.min.js",
            ),
          ),
          dest: "",
        },
      ],
    }),
  ],
  preview: {
    headers,
  },
});
