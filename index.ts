import type {Preset} from 'unocss'
import camelCase from 'camelcase'
import colors from 'daisyui/src/colors/index.js'

const colorEntries = Object.entries(colors)

const presetDaisy = (): Preset => ({
	name: 'daisy',
	theme: {
		colors: {
			...Object.fromEntries(
				colorEntries
					.filter(
						([color]) =>
							// Already in preset-mini
							// https://github.com/unocss/unocss/blob/0f7efcba592e71d81fbb295332b27e6894a0b4fa/packages/preset-mini/src/_theme/colors.ts#L11-L12
							!['transparent', 'current'].includes(color) &&
							// Added below
							!color.startsWith('base'),
					)
					.map(([color, value]) => [camelCase(color), value({})]),
			),
			base: Object.fromEntries(
				colorEntries
					.filter(([color]) => color.startsWith('base'))
					.map(([color, value]) => [color.replace('base-', ''), value({})]),
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
