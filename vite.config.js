import {defineConfig,loadEnv} from 'vite'
import vue from '@vitejs/plugin-vue'
import {resolve} from "path";
import AutoImport from 'unplugin-auto-import/vite'
import Components from 'unplugin-vue-components/vite'
import { ElementPlusResolver } from 'unplugin-vue-components/resolvers'
import VueSetupExtend from 'vite-plugin-vue-setup-extend'
import prismjs from 'vite-plugin-prismjs';
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
			AutoImport({
				resolvers: [ElementPlusResolver()],
			}),
			Components({
				resolvers: [ElementPlusResolver()],
			}),
			VueSetupExtend(),
			prismjs({
				languages: ['json'],
			}),
		],
		optimizeDeps: {
			include: ['@kangc/v-md-editor/lib/theme/vuepress.js'],
		},
		build: {
			minify: 'terser',
			terserOptions: {
				compress: {
					//生产环境时移除console
					// drop_console: process.env.VITE_DROP_CONSOLE,
					// drop_debugger: process.env.VITE_DROP_DEBUGGER
				},
			},
		},
		define: {
			// enable hydration mismatch details in production build
			__VUE_PROD_HYDRATION_MISMATCH_DETAILS__: 'true'
		},
		css: {
			preprocessorOptions: {
				scss: { api: 'modern-compiler' },
			}
		}
	}
})
