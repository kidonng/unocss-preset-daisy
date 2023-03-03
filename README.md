# unocss-preset-daisy

> [UnoCSS](https://github.com/unocss/unocss) preset for [daisyUI](https://github.com/saadeghi/daisyui)

[Checkout the demo!](https://unocss-preset-daisy.vercel.app/)

## Installation

```sh
npm install unocss unocss-preset-daisy @kidonng/daisyui
```

## Usage

### Vite

```js
import {defineConfig} from 'vite'
import unocss from 'unocss/vite'
import {presetUno, transformerDirectives} from 'unocss'
import {presetDaisy} from 'unocss-preset-daisy'

export default defineConfig({
	plugins: [
		unocss({
			transformers: [transformerDirectives()],
			presets: [presetUno(), presetDaisy()],
		}),
	],
})
```

### Astro

```js
import {defineConfig} from 'astro/config'
import unocss from 'unocss/vite'
import {presetUno, transformerDirectives} from 'unocss'
import {presetDaisy} from 'unocss-preset-daisy'

export default defineConfig({
	vite: {
		plugins: [
			unocss({
				transformers: [transformerDirectives()],
				presets: [presetUno(), presetDaisy()],
			}),
		],
	}
})
```

### Nuxt

To use UnoCSS with Nuxt, `@unocss/nuxt` must be installed as well.

```js
import {defineNuxtConfig} from 'nuxt'
import {presetUno, transformerDirectives} from 'unocss'
import {presetDaisy} from 'unocss-preset-daisy'

export default defineNuxtConfig({
	modules: ['@unocss/nuxt'],
	unocss: {
		transformers: [transformerDirectives()],
		presets: [presetUno(), presetDaisy()],
	},
})
```

### Entrypoint

After configuring the framework, add these imports to your entrypoint:

```js
// `@unocss/reset` comes with `unocss` so you don't have to install it separately
import '@unocss/reset/tailwind.css'
// Import `@kidonng/daisyui` **BEFORE** `uno.css`
import '@kidonng/daisyui/index.css'
import 'uno.css'
```

### Custom themes

> **Note**: Refer to [`@kidonng/daisyui` documentation](https://github.com/kidonng/daisyui#themes) for built-in themes.

Use [UnoCSS's theming system](https://github.com/unocss/unocss#extend-theme) to customize the theme.

```js
{
	// UnoCSS config
	transformers: [transformerDirectives()],
	presets: [presetUno(), presetDaisy()],
	// Custom themes
	theme: {
		// This is NOT a theme name, it must be `colors`
		colors: {
			// Refer to https://daisyui.com/docs/colors/ for the list of color names
			neutral: 'red',
			// Use camelCase instead of kebab-case (e.g. `neutral-focus`)
			neutralFocus: 'green',
			// Use object instead of hyphen for color grades/numbers (e.g. `base-100`)
			base: {
				100: 'blue',
			},
		},
	},
}
```

For details, please read [issue #9](https://github.com/kidonng/unocss-preset-daisy/issues/9#issuecomment-1452292840).

## Questions

**How to use a built-in theme / unstyled components?**

Please refer to [`@kidonng/daisyui` usage](https://github.com/kidonng/daisyui#usage).

**`@kidonng/daisyui/index.css` imports EVERYTHING!**

This entry imports all styles for easier use.

Since daisyUI is utility-first, the styles can be compressed very efficiently. Minified size of all styles is about 143 KB (as of writing), but **only 20 KB** after gzipping.

If this is unsatisfying, you can [only import the styles you actually use](https://github.com/kidonng/daisyui#usage). It may sound cumbersome but in fact not so, since they only need to be imported once globally.

You can also use [PurgeCSS](https://purgecss.com/), though it doesn't play nice with UnoCSS (or Vite in large).

**Why use `@kidonng/daisyui` instead of the official `daisyui` package?**

[`@kidonng/daisyui`](https://github.com/kidonng/daisyui) is a redistribution of daisyUI, to make it compatible with UnoCSS.

**I'm expecting a full UnoCSS port!**

Not currently, sorry. I envision a future where we don't need `@kidonng/daisyui`, which is one of the reasons this is a separate module.
