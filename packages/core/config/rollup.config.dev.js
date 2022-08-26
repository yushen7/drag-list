import path from 'path'
import { babel } from '@rollup/plugin-babel'
import nodeResolve from '@rollup/plugin-node-resolve'
import cjs from '@rollup/plugin-commonjs'
import json from '@rollup/plugin-json'
import livereload from 'rollup-plugin-livereload'
import serve from 'rollup-plugin-serve'

export default {
  input: path.resolve(__dirname, '../src/index.ts'),
  output: [
    {
      file: path.resolve(__dirname, '../lib/index.esm.dev.js'),
      format: 'es',
      sourcemap: true,
    },
    {
      name: 'DragList',
      file: path.resolve(__dirname, '../lib/index.umd.dev.js'),
      format: 'umd',
      sourcemap: true,
    },
  ],
  plugins: [
    cjs(),
    json(),
    nodeResolve({
      extensions: ['.ts', '.js'],
    }),
    babel({
      exclude: ['../../node_modules/**/*', '../node_modules/**/*'],
      configFile: path.resolve(__dirname, './.babelrc'),
      extensions: ['.ts', '.js'],
      babelHelpers: 'bundled',
    }),
    livereload(),
    serve({
      open: true,
      port: 13000,
      contentBase: '../core/',
      openPage: '/examples/index.html',
    }),
  ],
}