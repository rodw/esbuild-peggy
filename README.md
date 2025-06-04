# esbuild-peggy

An [esbuild](https://esbuild.github.io/) plugin for bundling [Peggy.js](https://peggyjs.org/) / [PEG.js](https://github.com/pegjs/pegjs) parsers directly into JavaScript and TypeScript source files.

Available as [esbuild-peggy](https://www.npmjs.com/package/esbuild-peggy) on npm.

## Quick Start

1. Add [esbuild-peggy](https://www.npmjs.com/package/esbuild-peggy) as a `dependency` - typically a `devDependency` - within your `package.json`; e.g.:

    ```console
    $ npm install --save-dev esbuild-peggy
    ```

    or

    ```json
    // FILE: package.json
    {
      "devDependencies": {
        "esbuild-peggy": "latest"
      }
    }
    ```

2. Configure esbuild-peggy as a [plugin](https://esbuild.github.io/plugins/) within your esbuild build script. E.g.:

    ```javascript
    // FILE: esbuild.js
    import { build } from "esbuild";
    import { peggyPlugin } from "esbuild-peggy";

    build({
      // ...
      plugins: [ peggyPlugin() ],
      loader: {
        ".pegjs": "js",
        ".peggy": "js"
      }
    });
    ```

    Note that you may optionally pass arbitrary [Peggy.js `ParserOptions`](https://peggyjs.org/documentation.html#generating-api) (as a map) in the first parameter to the `peggyPlugin()` function.

    Note also that `esbuild-peggy` is fully compatible with esbuild's "watch mode", and will automatically rebuild the generated parser implementation (and subsequently any appropriately defined dependencies) whenever the underlying `.pegjs`/`.peggy` source is modified (in that context).

3. Create your grammar file with a `.pegjs` or `.peggy` extension; e.g.:

   ```js
   // FILE: grammar.pegjs
   START = Number
   Number = "-"? [0-9]+ ("."[0-9]+)? { return parseFloat(text()); }
   ```

4. Import the grammar file directly in your JavaScript or TypeScript file; e.g.:

   ```ts
   // FILE: index.ts
   import parser from "./grammar.pegjs";
   console.log(parser.parse("-3.14"));
   ```

See the [examples](https://github.com/rodw/esbuild-peggy/tree/main/examples) directory within this repository for a complete demonstration of using `esbuild-peggy` with the `esbuild` bundler in [JavaScript](https://github.com/rodw/esbuild-peggy/tree/main/examples/javascript) and [TypeScript](https://github.com/rodw/esbuild-peggy/tree/main/examples/typescript).

## Licensing

The esbuild-peggy library and related documentation are made available under an [MIT License](https://opensource.org/license/MIT). For details, please see the [LICENSE.txt file](https://github.com/rodw/esbuild-peggy/blob/main/LICENSE.txt) in the root directory of the repository.

## Versioning

This module follows the [semver](https://semver.org/) version numbering strategy.

## About

### About esbuild

`esbuild` is a [tightly-designed](https://esbuild.github.io/), [blazingly-fast](https://esbuild.github.io/faq/#benchmark-details), [extraordinarily-common](https://npm-compare.com/esbuild,rollup,vite,webpack/#npm-anchor-downloads-trend) but oddly under-appreciated (though this seems to be changing) build tool/bundler framework implemented in [golang](https://go.dev/) with [JavaScript/TypeScript bindings](https://nodejs.org).

In case the [npm-compare.com link above](https://npm-compare.com/esbuild,rollup,vite,webpack/#download-compare) happens to go bad in the future note that as of this writing (mid-May 2025) that chart currently shows:
   - [esbuild](https://www.npmjs.com/package/esbuild) with ~60 million weekly downloads from npm
   - [rollup](https://www.npmjs.com/package/rollup) with ~40 million weekly downloads.
   - [webpack](https://www.npmjs.com/package/webpack) with ~32 million weekly downloads.
   - [vite](https://www.npmjs.com/package/vite) with ~28 million weekly downloads.

but note that vite currently embeds _both_ rollup _and_ esbuild, so that alone probably accounts for roughly half of the 60 million esbuild installs and 3/4ths of the 40 million rollup installs.

### About PEG.js/Peggy.js

[Peggy](https://www.npmjs.com/package/peggy) is the spiritual successor to [PEG.js](https://www.npmjs.com/package/pegjs), a robust but largely stagnant parser generator for the JavaScript stack, both server (node.js, etc) and client (browser).

(PEG.js has not been refreshed for nearly a decade - arguably it doesn't strictly _need_ to be: AST-style grammars have been a mature, well-established technology for easily half a century. But PEG.js still accrues more than half a million installs off of npmjs.org per week.)

### About esbuild-peggy

[esbuild-peggy](https://www.npmjs.com/package/esbuild-peggy) is a straightforward [esbuild plugin](https://esbuild.github.io/plugins/), implemented in TypeScript, that enables the (ESM) `import` or (CJS) `require` of `.pegjs` or `.peggy` grammar files directly within JavaScript or TypeScript source files (when bundled with esbuild).

For a complete working example of using `esbuild-peggy` in [JavaScript](https://github.com/rodw/esbuild-peggy/tree/main/examples/javascript) or [TypeScript](https://github.com/rodw/esbuild-peggy/tree/main/examples/typescript) see [examples directory within the main source repository](https://github.com/rodw/esbuild-peggy/tree/main/examples).

## Contributions Welcome

This plugin was initially developed to "scratch my own itch" (address a specific need I organically encountered), but (a) seems to be moderately robust already and (b) could be generalized to address additional needs and use-cases as they are identified.

Should you have any questions, encounter any issues, or have any feature requests/bug-fixes/enhancements you'd like to propose, please feel free submit them as [issues](https://github.com/rodw/esbuild-peggy/issues) or [pull requests](https://github.com/rodw/esbuild-peggy/pulls) on the GitHub platform (or other channels as appropriate).

See [HACKING.md](https://github.com/rodw/esbuild-peggy/blob/develop/README.md) for more information about building this module from source and other development related topics.
