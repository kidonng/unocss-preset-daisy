# unocss-preset-daisy

> [UnoCSS](https://github.com/unocss/unocss) preset for [daisyUI](https://github.com/saadeghi/daisyui)

[Checkout the demo!](https://unocss-preset-daisy.vercel.app/)

## Installation

```sh
npm install unocss unocss-preset-daisy @kidonng/daisyui
```

## Usage

### Vite config

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

### Nuxt config

To use UnoCSS with Nuxt, `@unocss/nuxt` must be installed.

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

### Script entry

```js
// daisyUI assumes Tailwind CSS's Preflight
import '@unocss/reset/tailwind.css'
// Import daisyUI **BEFORE** UnoCSS
import '@kidonng/daisyui/index.css'
import 'uno.css'
```

## Questions

**Why use `@kidonng/daisyui` instead of the official `daisyui` package?**

[`@kidonng/daisyui`](https://github.com/kidonng/daisyui) is a redistribution of daisyUI, to make it compatible with UnoCSS.

**How to use unstyled components?**

You need to [selectively import them](https://github.com/kidonng/daisyui#usage).

**Why is it importing ALL the styles?**

The `@kidonng/daisyui/index.css` entry imports all the styles for easy consuming.

Since daisyUI is utility-first, the styles can be compressed very efficiently. Minified size of all styles is about 150 KB, but only 23 KB after gzipping.

If you find this unsatisfying, you can always import only the components you actually use. It may sound cumbersome but in fact not so, since they only need to be imported once.

You can also use [PurgeCSS](https://purgecss.com/), though it doesn't play nice with UnoCSS (or Vite in large).

**I was expecting a full UnoCSS port!**

Not currently, sorry. I envision a future where we don't need `@kidonng/daisyui`, which is one of the reasons this is a separate module.
