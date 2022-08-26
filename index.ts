import type {Preset} from 'unocss'
import camelCase from 'camelcase'
import colors from 'daisyui/src/colors/index.js'

const baseShades = [100, 200, 300]

const presetDaisy = (): Preset => ({
	name: 'daisy',
	theme: {
		colors: {
			...Object.fromEntries(
				Object.entries(colors)
					.filter(
						([color]) =>
							![
								// Already in preset-mini
								// https://github.com/unocss/unocss/blob/0f7efcba592e71d81fbb295332b27e6894a0b4fa/packages/preset-mini/src/_theme/colors.ts#L11-L12
								'transparent',
								'current',
								// Added below
								...baseShades.map((shade) => `base-${shade}`),
							].includes(color),
					)
					.map(([color, value]) => [camelCase(color), value({})]),
			),
			base: Object.fromEntries(
				baseShades.map((shade) => [shade, colors[`base-${shade}`]!({})]),
			),
		},
	},
	rules: [
		[
			/^rounded-(?:box|btn|badge)$/,
			([name]) => ({'border-radius': `var(--${name!})`}),
		],
	],
})

export default presetDaisy
