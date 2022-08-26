import path from 'path'
import { babel } from '@rollup/plugin-babel'
import nodeResolve from '@rollup/plugin-node-resolve'
import dts from 'rollup-plugin-dts'
import cjs from '@rollup/plugin-commonjs'
import json from '@rollup/plugin-json'

import { terser } from 'rollup-plugin-terser'

export default [
  {
    input: path.resolve(__dirname, '../src/index.ts'),
    output: [
      {
        file: path.resolve(__dirname, '../lib/index.esm.js'),
        format: 'es',
        sourcemap: false,
      },
      {
        name: 'DragList',
        file: path.resolve(__dirname, '../lib/index.umd.js'),
        format: 'umd',
        sourcemap: false,
      },
    ],
    plugins: [
      cjs(),
      json(),
      nodeResolve({
        extensions: ['.ts'],
      }),
      babel({
        exclude: [/\/core-js\//],
        configFile: path.resolve(__dirname, './.babelrc'),
        extensions: ['.ts', '.js'],
      }),
      terser(),
    ],
  },
  {
    input: path.resolve(__dirname, '../src/types/index.ts'),
    output: [
      {
        file: path.resolve(__dirname, '../types/index.d.ts'),
        format: 'es',
      },
    ],
    plugins: [dts()],
  },
]
