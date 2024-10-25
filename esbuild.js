import esbuild from "esbuild";
import { umdWrapper } from "esbuild-plugin-umd-wrapper";
import { copy } from "esbuild-plugin-copy";
import inlineImage from "esbuild-plugin-inline-image";

// Common esbuild options for both UMD and ESM
const commonOptions = {
  entryPoints: ["src/index.ts"],
  bundle: true,
  minify: true, // Minifies the output
  sourcemap: false,
  target: "esnext",
  loader: {
    ".svg": "file", // Load .svg files as assets
    ".png": "file", // Load .png files as assets
    ".jpg": "file", // Load .jpg files as assets
    ".css": "file", // Load .css files as assets
  },
  plugins: [
    inlineImage({
      extensions: ".svg",
      limit: 100000,
    }),
    copy({
      resolveFrom: "cwd",
      assets: {
        from: ["./src/assets/styles.css"],
        to: ["./dist/assets/"],
      },
    }),
    umdWrapper({ libraryName: "credit-cards-inputs", globalIdentifier: "CCI" }),
  ],
};

// Build UMD version//
esbuild
  .build({
    ...commonOptions,
    format: "umd",
    outfile: "dist/credit-cards-inputs.umd.js",
  })
  .catch(() => process.exit(1));

// Build ESM version
esbuild
  .build({
    ...commonOptions,
    format: "esm",
    outfile: "dist/index.js",
  })
  .catch(() => process.exit(1));
