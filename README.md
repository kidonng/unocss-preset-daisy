# unocss-preset-daisy

> [UnoCSS](https://github.com/unocss/unocss) preset for [daisyUI](https://github.com/saadeghi/daisyui)

[Checkout the demo!](https://unocss-preset-daisy.vercel.app/)

## Installation

```sh
npm install unocss @unocss/reset unocss-preset-daisy @kidonng/daisyui
```

## Usage

### Vite

```js
import {defineConfig} from 'vite'
import unocss from 'unocss/vite'
import {presetUno, transformerDirectives} from 'unocss'
import presetDaisy from 'unocss-preset-daisy'

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
import presetDaisy from 'unocss-preset-daisy'

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
import presetDaisy from 'unocss-preset-daisy'

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
// daisyUI assumes Tailwind CSS's Preflight
import '@unocss/reset/tailwind.css'
// Import daisyUI **BEFORE** uno.css
import '@kidonng/daisyui/index.css'
import 'uno.css'
```

## Questions

**How to specify a theme / use unstyled components?**

Please refer to [daisyUI usage](https://github.com/kidonng/daisyui#usage).

**Why is it importing ALL the styles?**

The `@kidonng/daisyui/index.css` entry imports all the styles for easier consuming.

Since daisyUI is utility-first, the styles can be compressed _very_ efficiently. Minified size of all styles is about 143 KB, but **only 20 KB** after gzipping.

If you find this unsatisfying, you can [only import the styles you actually use](https://github.com/kidonng/daisyui#usage). It may sound cumbersome but in fact not so, since they only need to be imported once globally.

You can also use [PurgeCSS](https://purgecss.com/), though it doesn't play nice with UnoCSS (or Vite in large).

**Why use `@kidonng/daisyui` instead of the official `daisyui` package?**

[`@kidonng/daisyui`](https://github.com/kidonng/daisyui) is a redistribution of daisyUI, to make it compatible with UnoCSS.

**I was expecting a full UnoCSS port!**

Not currently, sorry. I envision a future where we don't need `@kidonng/daisyui`, which is one of the reasons this is a separate module.
