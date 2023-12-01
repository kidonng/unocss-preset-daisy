import { defineConfig } from 'vite';
import UnoCSS from 'unocss/vite';
import { presetUno, presetIcons } from 'unocss';
import { presetDaisy } from 'unocss-preset-daisy';

export default defineConfig({
  plugins: [
    UnoCSS({
      presets: [presetUno(), presetDaisy(), presetIcons()]
    })
  ]
});
