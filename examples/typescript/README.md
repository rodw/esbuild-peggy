# TypeScript Example

This directory contains an example of using esbuild-peggy to import [PEG.js / Peggy](https://peggyjs.org/) grammars directly into your TypeScript source files as part of an [esbuild](https://esbuild.github.io/) build.

## How To

1. Add esbuild-peggy as a dependency. E.g.:

   ```console
   $ npm install --save-dev esbuild-peggy
   ```

2. Configure esbuild-peggy as a plugin within your esbuild build file. E.g.:

   ```ts
   // FILE: esbuild.ts
   import { build } from "esbuild";
   import { peggyPlugin } from "esbuild-peggy";
    build({
      // ...
      plugins: [ peggyPlugin() ],
      loader: {
        ".pegjs": "ts",
        ".peggy": "ts"
      }
    });
    ```

    See [`build.ts`](./build.ts) for a complete example.

3. Create your grammar file with a `.pegjs` or `.peggy` extension. See [`src/math.pegjs`](./src/math.pegjs) for an example.

4. Import the grammar file directly in your TypeScript file, e.g.:

   ```ts
   // FILE: index.ts
   import parser from "./grammar.pegjs";
   console.log(parser.parse("1 + 2"));
   ```

   or

   ```ts
   // FILE: index.ts
   import parser from "./grammar.peggy";
   console.log(parser.parse("1 + 2"));
   ```

   See [`src/index.ts`](./src/index.ts) for a complete example.


5. Run the build (e.g.: `npx jiti esbuild.ts`) and execute the generated bundle (e.g.: `node dist/index.js`).

   See the `scripts` within [`package.json`](./package.json) for a complete example.

## Demonstration

### Short Version

If everything is working as intended the command:

```shell
$ npm run smoke-test
```

should yield the message:

```shell
✅ SUCCESS 😃
```

and a non-error (0) exit code, but that depends on some shell scripting that many not work perfectly on all platforms.

### Long Version

To build and run this example complete the following steps:

1. From the _root_ esbuild-peggy directory (the one containing `examples/`, `scripts/`, etc.), run:

   ```shell
   $ npm install && \
     npm run build:pack
   ```

   in order to generate the local version of the module used for development purposes (`./target/esbuild-peggy-latest.tgz`).

2. Within the `./examples/typescript/` directory (the one containing this `README.md` file):

   1. Run `npm install` to install the generated esbuild-peggy module into the local `node_modules`.

   2. Run `npm run build` to execute the [esbuild](https://esbuild.github.io/) build script, bundling files from the local [`./src`](./src) directory into `./dist`.

   3. Run `npm test` to execute a simple automated test of the generated files.

      Note that this target relies on some shell-scripting that may not work across all platforms.

   4. Run `npm run calc <expression>` in order to evaluate the given arithmetic expression using the generated parse. E.g.:

      ```console
      $ npm run calc 1 + 2
      ```

      or, directly:

      ```console
      $ node ./dist/index.ts 1 + 2
      ```

      should yield `3`; and

      ```console
      $ npm run calc 1 + x
      ```

      should generate a parsing error.

## Contents

This directory contains 6 primary files:

1. [`src/math.pegjs`](./src/math.pegjs) - a PEG.js/Peggy parser specification supporting arithmetic expressions like:
    - `2 + 3` (yielding `5`), or
    - `4 + (0.07 * 2) + -1` (yielding `3.14`)

2. [`src/math.d.pegjs.ts`](./src/math.d.pegjs.ts) - a local [declaration file](https://www.typescriptlang.org/docs/handbook/declaration-files/introduction.html) defining the TypeScript interface for the `math.pegjs` parser. In this case:

   ```ts
   {
     parse: (input: string) => number
   }
   ```

3. [`src/index.ts`](./src/index.ts) - a TypeScript file that _directly_ imports that `.pegjs`/`.peggy` grammar file in order to implement a command-line calculator:

    ```ts
    import parser from "./math.pegjs";
    console.log(parser.parse(process.argv[2]));
    ```

4. [`build.ts`](./build.ts) - an [esbuild](https://esbuild.github.io/) build script that demonstrates how to configure esbuild-peggy to support the direct import of a PEG.js or Peggy grammar file.

   This file can be executed via:

      - `npx jiti ./build.ts`, or
      - `npm run-script build`, or
      - `./build.ts`

   in order to generate `./dist/index.js`, the esbuild bundle that embeds all of [`./src`](./src)

5. [`package.json`](./package.json) - a conventional Node.js package file, naming (a local copy of) `esbuild-peggy` as `devDependency` and declaring a handful of convenient build-targets:

   Note that for local testing and development purposes, here the `esbuild-peggy` dependency is installed from a local tar file. In an external application you would normally use the more familiar:

   ```json
   "esbuild-peggy": "latest"
   ```

   (or some semver-version specification) to install the plugin from npm.

   The command:

   ```console
   $ npm install --save-dev esbuild-peggy
   ```

   (or the yarn or pnpm equivalent) is one good way to do that.

  1. [`tsconfig.json`](./tsconfig.json) - a basic [TypeScript configuration file](https://www.typescriptlang.org/docs/handbook/tsconfig-json.html), notably setting:

     ```json
     "compilerOptions": {
        "allowArbitraryExtensions": true,
     }
     ```

     to allow the `import [...] "grammar.pegjs"` and/or `import [...] "grammar.peggy"` calls to work as intended.
