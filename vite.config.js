import {defineConfig} from 'vite'
import vue from '@vitejs/plugin-vue'
import path from 'path';
import styleImport from 'vite-plugin-style-import'
// https://vitejs.dev/config/
export default defineConfig({
	resolve: {
		alias: {
			'@': path.resolve(__dirname, 'src')
		}
	},
	plugins: [
		vue(),
		styleImport({
			libs: [{
				libraryName: 'element-plus',
				esModule: true,
				ensureStyleFile: true,
				resolveStyle: (name) => {
					name = name.slice(3)
					return `element-plus/packages/theme-chalk/src/${name}.scss`;
				},
				resolveComponent: (name) => {
					return `element-plus/lib/${name}`;
				},
			}]
		})
	],
	css: {
		preprocessorOptions: {
			scss: {
				additionalData: '@use "./src/assets/style/variable.scss" as *;'
			}
		}
	},
	optimizeDeps: {
		include: ['@kangc/v-md-editor/lib/theme/vuepress.js'],
	},
})
