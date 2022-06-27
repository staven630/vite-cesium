import path from 'path'
import { imageRegexp } from '../../src/utils/regexp'

export const buildConfig = {
  target: "es2015",
  minify: "terser",
  cssTarget: 'chrome80',
  brotliSize: false,
  chunkSizeWarningLimit: 1500, // 块大小警告的限制
  cssCodeSplit: true,
  emptyOutDir: true,
  terserOptions: {
    compress: {
      // 生产环境去除打包以及debugger
      drop_debugger: true,
      drop_console: true
    }
  },
  rollupOptions: {
    output: {
      manualChunks(id) {
        if (id.includes('node_modules')) {
          return id.toString().replace(/\.pnpm\/|\@/g, '').split('node_modules/')[1].split('/')[0].toString()
        }
      },
      entryFileNames: `assets/js/[name]-[hash].js`, // 入口文件
      chunkFileNames: `assets/js/[name]-[hash].js`, // 块文件
      assetFileNames(chunkInfo) {
        if (chunkInfo.name) {
          const [name, ext] = path.basename(chunkInfo.name).split('.')
          return `assets/${imageRegexp.test(ext.toLowerCase()) ? 'images' : ext}/${name.toLowerCase()}-[hash].${ext}`
        }
        return ''
      },
    },
  },
}
