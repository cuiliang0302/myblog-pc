import {defineConfig} from 'vite'
import vue from '@vitejs/plugin-vue'
import path from 'path';
import VitePluginElementPlus from 'vite-plugin-element-plus'

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
			VitePluginElementPlus({
				// 如果你需要使用 [component name].scss 源文件，你需要把下面的注释取消掉。
				// 对于所有的 API 你可以参考 https://github.com/element-plus/vite-plugin-element-plus
				// 的文档注释
				// useSource: true
				format: mode === 'development' ? 'esm' : 'cjs',
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
	}
})
