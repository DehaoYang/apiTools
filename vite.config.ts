import { defineConfig, loadEnv } from "vite";
import vue from "@vitejs/plugin-vue";
import path from "path";
import AutoImport from "unplugin-auto-import/vite";
import Components from "unplugin-vue-components/vite";
import { ElementPlusResolver } from "unplugin-vue-components/resolvers";
import { createHtmlPlugin } from "vite-plugin-html";
import { createSvgIconsPlugin } from 'vite-plugin-svg-icons'

export default defineConfig(({ command, mode }) => {
  const env = loadEnv(mode, process.cwd(), "");
  return {
    base: "./",
    server: {
      host: "0.0.0.0",
      cors: true,
      proxy: {
        "/fdzh/manager": {
          target: "https://www.5ialways.cn/",
          changeOrigin: true,
        }
      },
    },
    plugins: [
      vue(),
      AutoImport({
        resolvers: [ElementPlusResolver()],
      }),
      Components({
        resolvers: [ElementPlusResolver()],
      }),
      createSvgIconsPlugin({
        // 指定需要缓存的图标文件夹
        iconDirs: [path.resolve(process.cwd(), "src/assets/icons")],
        // 指定symbolId格式
        symbolId: "icon-[dir]-[name]"
      }),
      createHtmlPlugin({
        inject: {
          data: {
            mode: env.VITE_APP_MODE,
          },
        },
      }),
    ],
    define: {
      "process.env": {},
    },
    build: {
      manifest: false,
      rollupOptions: {
        output: {
          entryFileNames: `[name].js`,
          chunkFileNames: `[name].js`,
          assetFileNames: `[name].[ext]`,
        },
      },
    },
    resolve: {
      // 配置路径别名
      alias: {
        "@": path.resolve(__dirname, "./src"),
      },
    }
  };
});
