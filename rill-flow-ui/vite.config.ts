import { defineApplicationConfig } from '@vben/vite-config';
import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import legacy from '@vitejs/plugin-legacy' // need this
import { legacyQiankun } from 'vite-plugin-legacy-qiankun'
export default defineApplicationConfig({
  overrides: {
    optimizeDeps: {
      include: [
        'echarts/core',
        'echarts/charts',
        'echarts/components',
        'echarts/renderers',
        'qrcode',
        '@iconify/iconify',
        'ant-design-vue/es/locale/zh_CN',
        'ant-design-vue/es/locale/en_US',
      ],
      exclude: ['@antv/x6-vue-shape'],
    },
    server: {
      host: true,
      proxy: {
        '/flow': {
          target: 'http://127.0.0.1:8080',
          changeOrigin: true,
          ws: true,
          rewrite: (path) => path.replace(new RegExp(`^/basic-api`), ''),
        },
        '/template': {
          target: 'http://127.0.0.1:8080',
          changeOrigin: true,
          ws: true,
          rewrite: (path) => path.replace(new RegExp(`^/basic-api`), ''),
        }
      },
    },
  },
});

export default defineConfig({
  plugins: [
    vue(),
    legacy(),
    legacyQiankun({
      name: 'your micro app name',
      devSandbox: true
    })
  ]
})
