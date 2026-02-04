import { defineConfig } from "vite";

export default defineConfig({
  root: "src",
  build: {
    outDir: "../dist",
    emptyOutDir: true,
  },
  // GitHub Pages serves the site from /<repo>/.
  // Change "obs" if your repo name is different.
  base: "/obs/",
});
