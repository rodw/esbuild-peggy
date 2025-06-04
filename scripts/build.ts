#!/usr/bin/env ./node_modules/.bin/jiti

// This is the primary entry point for the esbuild-based build pipeline.
// You can execute this script directly, but we recommend using the build
// targets defined in ../package.json (such as `npm run build`) instead.

import path from "node:path";
import esbuild from "esbuild";
import { clean } from "esbuild-plugin-clean";
import { makePackageJson } from "./esbuild-make-package-json";
import parentPkg from "../package.json" with { type: "json" };

const shouldClean = process.argv.includes("--clean");
const shouldWatch = process.argv.includes("--watch");

const TARGET_DIR = "target";
const DIST_DIR = path.resolve(TARGET_DIR, "dist");
const LOG_LEVEL = "info";

const rootBuildOpts: esbuild.BuildOptions = {
  outdir: DIST_DIR,
  logLevel: LOG_LEVEL
}

const commonBuildOpts: esbuild.BuildOptions = {
  ...rootBuildOpts,
  bundle: true,
  packages: "external",
  sourcemap: false,
  minify: true,
  tsconfig: "tsconfig.json",
  entryPoints: [ "src/esbuild-peggy.ts" ],
};

if (shouldClean) {
  await esbuild.build({
    plugins: [
      clean({patterns: [ DIST_DIR ]})
    ]
  })
}

const buildTargets: esbuild.BuildOptions[] = [
  // TEXT FILES
  {
    ...rootBuildOpts,
    entryPoints: [ "README.md", "LICENSE.txt", "AUTHORS.txt", "CONTRIBUTORS.txt" ],
    loader: {
      ".txt": "copy",
      ".md": "copy"
    }
  },
  // PACKAGE.JSON
  {
    ...rootBuildOpts,
    plugins: [
      makePackageJson({
        allowOverwrite: true,
        contents: {
          name: parentPkg.name,
          version: parentPkg.version,
          license: parentPkg.license,
          author: parentPkg.author,
          type: parentPkg.type,
          homepage: parentPkg.homepage,
          bugs: parentPkg.bugs,
          repository: parentPkg.repository,
          description: parentPkg.description,
          keywords: parentPkg.keywords,
          engines: parentPkg.engines,
          dependencies: parentPkg.dependencies,
          main: "./esbuild-peggy.cjs",
          module: "./esbuild-peggy.js",
          types: "./esbuild-peggy.d.ts",
          exports: {
            ".": {
              import: {
                types: "./esbuild-peggy.d.ts",
                default: "./esbuild-peggy.js"
              },
              require: {
                types: "./esbuild-peggy.d.ts",
                default: "./esbuild-peggy.cjs"
              },
              default: {
                types: "./esbuild-peggy.d.ts",
                default: "./esbuild-peggy.js"
              }
            }
          }
        }
      })
    ]
  },
  // TYPES.D.TS
  {
    ...rootBuildOpts,
    entryPoints: [ "src/**/*.d.ts" ],
    loader: { ".ts": "copy" }
  },
  // MJS (ESM MODULE)
  {
    ...commonBuildOpts,
    platform: "neutral",
    outExtension: { ".js": ".js" }
  },
  // CJS (COMMONJS MODULE)
  {
    ...commonBuildOpts,
    platform: "node",
    outExtension: { ".js": ".cjs" }
  }
]

async function buildTarget(buildOptions: esbuild.BuildOptions): Promise<unknown> {
  if (shouldWatch) {
    const ctx = await esbuild.context(buildOptions);
    return await ctx.watch();
  } else {
    return await esbuild.build(buildOptions);
  }
}

async function buildAll() {
  await Promise.all(
    buildTargets.map((opts: esbuild.BuildOptions) => buildTarget(opts))
  );
}

buildAll();
