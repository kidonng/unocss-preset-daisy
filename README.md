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

### Script entry

```js
// daisyUI assumes Tailwind CSS's Preflight
import '@unocss/reset/tailwind.css'
// Import daisyUI **BEFORE** UnoCSS
import '@kidonng/daisyui/index.css'
import 'uno.css'
```

## Questions

**Why use `@kidonng/daisyui` instead of the original `daisyui`?**

[`@kidonng/daisyui`](https://github.com/kidonng/daisyui) is a redistribution of daisyUI, to make it compatible with UnoCSS.

**Do I need to import ALL the styles?**

You can also [selectively import them](https://github.com/kidonng/daisyui#usage), though it can be cumbersome.

That said, due to the utility nature, the styles are compressed very efficiently. Minified size of all styles is about 150 KB, but less than 23 KB after gzipping.

You can also try [PurgeCSS](https://purgecss.com/), though it doesn't play nice with UnoCSS (or Vite in large).

**I was expecting a full UnoCSS port!**

Not currently, sorry. I envision a future where we don't need `@kidonng/daisyui`, which is one of the reasons this is a separate module.
