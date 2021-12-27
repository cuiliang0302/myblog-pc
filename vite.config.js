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
			terserOptions: {
				compress: {
					drop_console: mode !== 'serve',
					// 默认是true
					drop_debugger: mode !== 'serve'
				}
			},
		}
	}
})
