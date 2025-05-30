#!/usr/bin/env node
import { build } from "esbuild";
import { peggyPlugin } from "esbuild-peggy";

build({
  entryPoints: ["src/index.js"],
  bundle: true,
  outfile: "dist/index.js",
  plugins: [
    peggyPlugin()
  ],
  loader: {
    ".pegjs": "js",
    ".peggy": "js"
  }
}).catch((err) => {
  console.error("BUILD ERROR: ", err);
  process.exit(1);
});
