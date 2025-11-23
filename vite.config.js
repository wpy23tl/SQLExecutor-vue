import { fileURLToPath, URL } from 'node:url'

import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import vueDevTools from 'vite-plugin-vue-devtools'

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    vue(),
    vueDevTools(),
  ],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url))
    },
  },
  // --- 新增以下配置 ---
  server: {
    port: 5173, // 确保前端端口是 5173
    open: true, // 运行 npm run dev 时自动打开浏览器
    proxy: {
      // 代理配置：遇到 /api 开头的请求，转发到后端
      '/api': {
        target: 'http://localhost:8080', // 后端接口地址
        changeOrigin: true, // 允许跨域
        // 路径重写：去掉 /api 前缀
        // 例如：前端请求 /api/execute/executeSql -> 后端收到 /execute/executeSql
        rewrite: (path) => path.replace(/^\/api/, '')
      }
    }
  }
})