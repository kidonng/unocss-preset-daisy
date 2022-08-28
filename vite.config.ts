import {defineConfig} from 'vite'
// eslint-disable-next-line n/file-extension-in-import
import unocss from 'unocss/vite'
import {presetUno, presetIcons, transformerDirectives} from 'unocss'
import presetDaisy from './index.js'

export default defineConfig({
	plugins: [
		unocss({
			transformers: [transformerDirectives()],
			presets: [presetUno(), presetDaisy(), presetIcons()],
		}),
	],
})
