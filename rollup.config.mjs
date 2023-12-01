import typescript from '@rollup/plugin-typescript';
import { terser } from 'rollup-plugin-terser';
import { defineConfig } from 'rollup';

const outputOptions = {
  format: 'umd',
  name: 'uodule'
};

const config = defineConfig({
  input: './index.ts',
  output: [
    {
      file: 'dist/index.cjs',
      ...outputOptions
    },
    {
      file: 'dist/index.min.cjs',
      ...outputOptions,
      plugins: [terser()]
    },
    {
      file: 'dist/index.mjs',
      format: 'esm'
    },
    {
      file: 'dist/index.min.mjs',
      format: 'esm',
      plugins: [terser()]
    }
  ],
  plugins: [
    typescript({
      declaration: true
    })
  ]
});

export default config;
