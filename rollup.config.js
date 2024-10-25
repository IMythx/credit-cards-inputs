import typescript from "@rollup/plugin-typescript";
import { nodeResolve } from "@rollup/plugin-node-resolve";
import commonjs from "@rollup/plugin-commonjs";
import copy from "rollup-plugin-copy";
import postcss from "rollup-plugin-postcss";
import url from "@rollup/plugin-url";
import image from "rollup-plugin-img";

export default [
  {
    input: "src/index.ts", // Entry point of your library
    output: {
      file: "dist/credit-card-inputs.umd.js", // Output file for UMD build
      format: "umd", // UMD format
      name: "CCI", // Global variable name in browser
      sourcemap: false, // Enable source maps for debugging
      assetFileNames: "assets/[name][extname]",
    },
    plugins: [
      nodeResolve(), // Resolve dependencies in node_modules
      commonjs(), // Convert CommonJS modules to ES6 if needed
      // image({
      //   extensions: /\.(png|jpg|jpeg|gif|svg)$/,
      //   limit: 100000,
      // }),
      url({
        include: ["**/*.png", "**/*.jpg", "**/*.svg"],
        limit: 100000, // Always copy assets, do not inline them as base64
        fileName: "[name][extname]", // Keep the original name
        destDir: "dist/assets", // Output directory for assets
      }),
      // Copy static assets (images, fonts, etc.)
      copy({
        targets: [
          { src: "src/assets/styles.css", dest: "dist/" }, // Copy all assets to dist/assets
        ],
      }),
      typescript(), // Compile TypeScript to JavaScript
      postcss({
        extract: true, // Extract CSS to a separate file
      }),
    ],
  },
  {
    input: "src/index.ts",
    output: {
      file: "dist/index.js", // ESM version (not minified)
      format: "es",
    },
    plugins: [
      nodeResolve({
        extensions: [".js", ".ts"], // Add extensions to resolve .ts files
      }), // Resolve dependencies in node_modules
      commonjs(), // Convert CommonJS modules to ES6 if needed
      postcss({
        extract: true,
      }),
      // image({
      //   extensions: /\.(png|jpg|jpeg|gif|svg)$/,
      //   limit: 10000,
      // }),
      url({
        include: ["**/*.svg", "**/*.png", "**/*.jpg"],
        limit: 100000,
        fileName: "[dirname][name][extname]",
        destDir: "dist/assets",
      }),

      copy({
        targets: [{ src: "src/assets/styles.css", dest: "dist/" }],
      }),
      typescript(), // Compile TypeScript to JavaScript
    ],
  },
];
