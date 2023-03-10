import { UserConfigExport, ConfigEnv, loadEnv } from "vite";
import vue from "@vitejs/plugin-vue";
import { resolve } from "path";
import { createSvgIconsPlugin } from "vite-plugin-svg-icons";
import { viteMockServe } from "vite-plugin-mock";
import vueSetupExtend from "vite-plugin-vue-setup-extend";

// https://vitejs.dev/config/
export default ({ command, mode }: ConfigEnv): UserConfigExport => {
  // 根据当前工作目录中的 `mode` 加载 .env 文件
  // 设置第三个参数为 '' 来加载所有环境变量，而不管是否有 `VITE_` 前缀。
  const { VITE_PUBLIC_PATH, VITE_PORT, VITE_BASE_URL, VITE_PROXY_URL } = loadEnv(mode, process.cwd());
  // 开发模式自动设置代理
  const proxy = {};
  if (command === "serve") {
    proxy[VITE_BASE_URL] = {
      target: VITE_PROXY_URL,
      changeOrigin: true,
      rewrite: path => path.replace(/^\/api/, ""),
    };
  }
  return {
    base: VITE_PUBLIC_PATH,
    root: process.cwd(),
    // 配置路径别名
    resolve: {
      alias: {
        "@": resolve(__dirname, "src"),
      },
    },
    css: {
      preprocessorOptions: {
        // 配置全局scss文件
        scss: {
          additionalData: '@import "@/assets/style/variables.scss";',
        },
      },
    },
    //  https://cn.vitejs.dev/config/server-options.html#server-proxy
    server: {
      hmr: true,
      host: "0.0.0.0",
      port: Number(VITE_PORT),
      open: false,
      proxy: proxy,
    },
    // 插件
    plugins: [
      vue(),
      // setup script标签上定义组件name
      vueSetupExtend(),
      // https://github.com/anncwb/vite-plugin-svg-icons
      createSvgIconsPlugin({
        // 指定需要缓存的图标文件夹
        iconDirs: [resolve(process.cwd(), "src/assets/svg")],
        // 指定symbolId格式
        symbolId: "icon-[dir]-[name]",
      }),
      // https://github.com/anncwb/vite-plugin-mock
      viteMockServe({
        ignore: /^\_/, // 忽略读取指定格式的文件
        mockPath: "mock", // 设置模拟.ts 文件的存储文件夹
        localEnabled: command === "serve", // 开发环境启用mock
        prodEnabled: command !== "serve", // 生产环境启用mock
        // 生产环境被注入到mian.ts的代码
        injectCode: `
              import { setupProdMockServer } from '../mock/_createProductionServer';
              setupProdMockServer();
              `,
      }),
    ],
  };
};
