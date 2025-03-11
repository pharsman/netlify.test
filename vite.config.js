import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";
import federation from "@originjs/vite-plugin-federation";

export default defineConfig({
  plugins: [
    react(),
    { include: "**/*.jsx" },
    federation({
      name: "Hr",
      filename: "remoteEntry.js",
      remotes: {
        // masterComponents: 'https://oneadmin.upgaming.dev/mc/assets/remoteEntry.js',
        masterComponents:
          "https://oneadmin.upgaming.dev/mcnew/assets/remoteEntry.js",
      },
      shared: ["react", "react-dom"],
    }),
  ],

  css: {
    preprocessorOptions: {
      scss: {
        additionalData: `
          @use "@/styles/_fonts.scss" as *;
          @use "@/styles/_mixins.scss" as *;
        `,
      },
    },
    // modules: {
    //   localsConvention: 'camelCaseOnly',
    // },
  },

  build: {
    modulePreload: false,
    target: "esnext",
    minify: false,
    cssCodeSplit: false,
  },

  resolve: {
    extensions: [".mjs", ".js", ".ts", ".jsx", ".tsx", ".json"],
    alias: {
      // eslint-disable-next-line no-undef
      "@": path.resolve(__dirname, "./src"),
    },
  },
});
