#!/usr/bin/env ./node_modules/.bin/jiti
import { build } from "esbuild";
import { peggyPlugin } from "esbuild-peggy";

build({
  entryPoints: ["src/index.ts"],
  bundle: true,
  outdir: "dist",
  plugins: [
    peggyPlugin()
  ],
  loader: {
    ".pegjs": "ts",
    ".peggy": "ts"
  }
}).catch((err) => {
  console.error("BUILD ERROR: ", err);
  process.exit(1);
});
