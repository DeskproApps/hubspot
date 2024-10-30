import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import copy from "rollup-plugin-copy";

const PORT = parseInt(process.env.VITE_DEV_SERVER_PORT || "3003");

// https://vitejs.dev/config/
export default defineConfig({
  base: "",
  plugins: [react()],
  server: {
    port: PORT,
  },
  build: {
    rollupOptions: {
      onwarn(warning, warn) {
        if (warning.code === "MODULE_LEVEL_DIRECTIVE") {
          return;
        }
        warn(warning);
      },
      plugins: [
        copy({
          hook: "writeBundle",
          targets: [
            { src: "./manifest.json", dest: "./dist/" },
            { src: "./DESCRIPTION.md", dest: "./dist/" },
            { src: "./SETUP.md", dest: "./dist/" },
            { src: "./icon.svg", dest: "./dist/" },
            { src: "./docs", dest: "./dist/" },
          ],
        }),
      ],
    }
  },
});
