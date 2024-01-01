declare module 'daisyui/src/theming/index.js' {
	// The value can also be a string, ignore them as they are filtered
	const colors: Record<string, string>
	export default colors
}

declare module 'daisyui/dist/utilities.js' {
	import type {CssInJs} from 'postcss-js'

	const utilities: CssInJs
	export default utilities
}

declare module 'daisyui/dist/base.js' {
	import type {CssInJs} from 'postcss-js'

	const base: CssInJs
	export default base
}

declare module 'daisyui/dist/unstyled.js' {
	import type {CssInJs} from 'postcss-js'

	const unstyled: CssInJs
	export default unstyled
}


declare module 'daisyui/dist/styled.js' {
	import type {CssInJs} from 'postcss-js'

	const styled: CssInJs
	export default styled
}

declare module 'daisyui/dist/utilities-unstyled.js' {
	import type {CssInJs} from 'postcss-js'

	const utilitiesUnstyled: CssInJs
	export default utilitiesUnstyled
}

declare module 'daisyui/dist/utilities-styled.js' {
	import type {CssInJs} from 'postcss-js'

	const utilitiesStyled: CssInJs
	export default utilitiesStyled
}

declare module 'daisyui/src/theming/themes.js' {
	const themes: Record<string, Record<string, string>>
	export default themes
}

declare module 'daisyui/src/lib/utility-classes.js' {
  import type { CssInJs } from 'postcss-js'

  const utilityClasses: CssInJs
  export default utilityClassess
}

declare module 'daisyui/src/theming/functions.js' {
	import type {CssInJs} from 'postcss-js'

	export function injectThemes(
		addBase: (theme: CssInJs) => void,
		config: (key: string) => unknown,
		themes: Record<string, Record<string, string>>,
	): void
}
