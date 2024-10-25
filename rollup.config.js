import typescript from "@rollup/plugin-typescript";
import { nodeResolve } from "@rollup/plugin-node-resolve";
import commonjs from "@rollup/plugin-commonjs";
import copy from "rollup-plugin-copy";
import url from "@rollup/plugin-url";
import { minify } from "rollup-plugin-esbuild-minify";

export default [
  {
    input: "src/index.ts", // Entry point of your library
    output: {
      file: "dist/credit-cards-inputs.umd.js", // Output file for UMD build
      format: "umd", // UMD format
      name: "CCI", // Global variable name in browser
      sourcemap: false, // Enable source maps for debugging
    },
    plugins: [
      nodeResolve(), // Resolve dependencies in node_modules
      commonjs(), // Convert CommonJS modules to ES6 if needed
      url({
        include: ["**/*.svg"],
        limit: 100000, // Always copy assets, do not inline them as base64
      }),
      // Copy static assets (images, fonts, etc.)
      copy({
        targets: [
          { src: "src/assets/styles.css", dest: "dist/assets/" }, // Copy all assets to dist/assets
        ],
      }),
      typescript(), // Compile TypeScript to JavaScript
      minify(),
    ],
  },
  {
    input: "src/index.ts",
    output: {
      file: "dist/index.js", // ESM version (not minified)
      format: "es",
      sourcemap: false,
    },
    plugins: [
      nodeResolve(), // Resolve dependencies in node_modules
      commonjs(), // Convert CommonJS modules to ES6 if needed
      url({
        include: ["**/*.svg"],
        limit: 100000,
      }),
      copy({
        targets: [{ src: "src/assets/styles.css", dest: "dist/assets/" }],
      }),
      typescript(), // Compile TypeScript to JavaScript
      minify(),
    ],
  },
];
