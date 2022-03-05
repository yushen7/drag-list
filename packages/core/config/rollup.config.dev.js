import path from "path";
import { babel } from "@rollup/plugin-babel";
import nodeResolve from "@rollup/plugin-node-resolve";
import livereload from "rollup-plugin-livereload";
import serve from "rollup-plugin-serve";

export default {
  input: path.resolve(__dirname, "../src/index.ts"),
  output: [
    {
      file: path.resolve(__dirname, "../lib/index.esm.js"),
      format: "es",
      sourcemap: true,
    },
    {
      name: 'DragList',
      file: path.resolve(__dirname, "../lib/index.umd.js"),
      format: "umd",
      sourcemap: true,
    },
  ],
  plugins: [
    nodeResolve({
      extensions: [".ts"],
    }),
    babel({
      exclude: "../node_modules/**/*",
      configFile: path.resolve(__dirname, "./.babelrc"),
      extensions: [".ts", ".js"],
    }),
    livereload(),
    serve({
      open: true,
      port: 13000,
      contentBase: "../core/",
      openPage: "/examples/index.html",
    }),
  ],
};
