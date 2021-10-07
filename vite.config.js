import {defineConfig} from 'vite'
import vue from '@vitejs/plugin-vue'
import path from 'path';
import Components from 'unplugin-vue-components/vite'
import {ElementPlusResolver} from 'unplugin-vue-components/resolvers'

// https://vitejs.dev/config/
export default defineConfig(({mode}) => {
	return {
		resolve: {
			alias: {
				'@': path.resolve(__dirname, 'src')
			}
		},
		plugins: [
			vue(),
			Components({
				resolvers: [ElementPlusResolver()],
			}),
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
		build: {
			rollupOptions: {
				output: {
					manualChunks(id) {
						if (id.includes('node_modules')) {
							return id.toString().split('node_modules/')[1].split('/')[0].toString();
						}
					}
				}
			}
		}
	}
})
