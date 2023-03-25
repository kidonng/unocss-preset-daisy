import {defineConfig} from 'vite'
// eslint-disable-next-line n/file-extension-in-import
import unocss from 'unocss/vite'
import {presetUno, presetIcons} from 'unocss'
import {presetDaisy} from '../index.js'

export default defineConfig({
	plugins: [
		unocss({
			presets: [presetUno(), presetDaisy(), presetIcons()],
		}),
	],
})
