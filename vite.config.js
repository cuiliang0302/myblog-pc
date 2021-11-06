import {defineConfig,loadEnv} from 'vite'
import vue from '@vitejs/plugin-vue'
import {resolve} from "path";
import Components from 'unplugin-vue-components/vite'
import { ElementPlusResolver } from 'unplugin-vue-components/resolvers'

// https://vitejs.dev/config/
export default defineConfig(({mode}) => {
	process.env = {...process.env, ...loadEnv(mode, process.cwd())};
	return {
		resolve: {
			alias: {
				"@": resolve(__dirname, "src")
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
					additionalData: '@import "./src/assets/style/variable.scss";'
				}
			}
		},
		optimizeDeps: {
			include: ['@kangc/v-md-editor/lib/theme/vuepress.js'],
		},
		build: {
			// rollupOptions: {
			// 	output: {
			// 		manualChunks(id) {
			// 			if (id.includes('node_modules')) {
			// 				return id.toString().split('node_modules/')[1].split('/')[0].toString();
			// 			}
			// 		}
			// 	}
			// },
			// terserOptions: {
			// 	compress: {
			// 		//生产环境时移除console
			// 		drop_console: process.env.VITE_DROP_CONSOLE,
			// 		drop_debugger: process.env.VITE_DROP_DEBUGGER
			// 	},
			// },
		}
	}
})
