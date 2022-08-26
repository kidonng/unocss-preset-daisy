# unocss-preset-daisy

> [UnoCSS](https://github.com/unocss/unocss) preset for [daisyUI](https://github.com/saadeghi/daisyuihttps://github.com/saadeghi/daisyui)

## Installation

```sh
npm install unocss unocss-preset-daisy @kidonng/daisyui
```

## Usage

### Vite config

```js
import {defineConfig} from 'vite'
import {presetUno, transformerDirectives} from 'unocss'
import unocss from 'unocss/vite'
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

import '@kidonng/daisyui/components/unstyled/index.css'
import '@kidonng/daisyui/components/styled/index.css'
import '@kidonng/daisyui/themes/index.css'
import '@kidonng/daisyui/utilities/unstyled/index.css'
import '@kidonng/daisyui/utilities/styled/index.css'

// Import UnoCSS **AFTER** daisyUI
import 'uno.css'
```

## Questions

**Why use `@kidonng/daisyui` instead of the original `daisyui`?**

[`@kidonng/daisyui`](https://github.com/kidonng/daisyui) is a redistribution of daisyUI, to make it compatible with UnoCSS.

**Do I need to import ALL the styles?**

You can selectively import them, if you don't mind the cumbersome work.

That said, due to the utility nature, the styles are compressed very efficiently. Minified size of all styles is about 150 KB, but less than 23 KB after gzipping.

You can also try [PurgeCSS](https://purgecss.com/), though it doesn't play nice with UnoCSS (or Vite in large).

**I was expecting a full UnoCSS port!**

Not currently, sorry. I envision a future where we don't need `@kidonng/daisyui`, which is one of the reasons this is a separate module.
