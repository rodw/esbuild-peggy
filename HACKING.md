# Hacking

> This document provides information relevant to developers who wish to build, test or modify the core implementation itself.
>
> If you're interested in using the published module within your own projects, please see the [README.md](README.md#quick-start) file for the main module.

## Prerequisites

This module is developed with [node.js](https://nodejs.org/) using [npm](https://docs.npmjs.com/cli/v11) as the package manager.

We recommend using a version manager such as [nvm](https://github.com/nvm-sh/nvm#readme) or [fnm](https://github.com/Schniz/fnm) to manage your node environment.

This module is implemented in [TypeScript](https://www.typescriptlang.org/), and uses [esbuild](https://esbuild.github.io/) to drive the primary build and bundling process, but these and all other third-party dependencies can by installed automatically via `npm install`.

## Obtaining the Source

The source code for this module can be obtained via [git](https://git-scm.com/) using:

```console
$ git clone https://github.com/rodw/esbuild-peggy.git
```

or:

```console
$ git clone git@github.com/rodw/esbuild-peggy.git
```

or downloaded directly from GitHub at <https://github.com/rodw/esbuild-peggy>.

## Installing Dependencies

To install all third-party dependencies needed to build, test or package the `esbuild-peggy` module, run:

```console
$ npm install
```

## Building the Module

To compile (transpile) and bundle the raw source code into a form suitable for `import` or `require` into other JavaScript or TypeScript files; and tarball suitable for publishing on [npmjs.com](https://www.npmjs.com/) (and other repositories) or importing into other modules as an external dependencies, run:

```console
$ npm run build:all
```

This will generate a number of files into a local `./target` directory (creating it if necessary).


## Testing the Module

Once the local module has been built and packaged (under `./target`) you may run:

```console
$ npm test
```

to perform an end-to-end test.

## Other Useful Build Targets

The `scripts` section of [`package.json`](./package.json) defines a large number of "build targets" that may be convenient when working with this repository.

### Executing Build Targets

Each target may be executed via:

```console
$ npm run <target-name>
```

Multiple targets may be executed sequentially via:

```console
$ npm run many <target-one> <target-two> <etc>
```

which is (more or less) equivalent to:

```console
$ npm run <target-one> && \
  npm run <target-two> && \
  npm run <etc>
```

### Troubleshooting

Note that many of the build targets depend on third-party dependencies that are expected to be found in `node_modules`. If you run into problems invoking even the most basic build targets (e.g., `npm run clean`) you may want to run:

```console
$ rm -rf node_modules package-lock.json target tsconfig.tsbuildinfo
```

to forcibly remove all installed or generated files, and then:

```console
$ npm install
```

to re-install a fresh copy of all third-party dependencies.

Note that you may verify that your environment is healthy and properly configured with the recommended versions of node and npm by running:

```console
$ npm doctor
```

### Other Build Targets

#### clean

  * `clean` - remove generated files (e.g., `./target`) from the root module

  * `clean:dep` -  remove duplicate or extraneous third-party dependencies from the root module; alias for `dep:clean`

  * `clean:all` - clean generated _and_ installed files in the root module
    - equivalent to `npm run clean && npm run clean:dep`

  * `clean:eg` - remove all generated _and_ installed files from the `./examples` sub-modules

  * `nuke` - force a full refresh: removes all generated _and_ installed files from _both_ the root _and_ sub-modules; then invokes `npm install` to restore a fresh copy of `node_modules`

#### build

  * `build` - compile (transpile) and bundle source files (into `./target/dist`)
  
  * `rebuild` - clean then build

  * `build:watch` - iteratively invoke `build` whenever a source file is changed

  * `build:all` - compile and bundle source files then package as a tarball suitable for publication or installation as a node module

  * `rebuild:all` - clean:all then build:all

  * `nuke:build` - force a full refresh of all generated and installed files then rebuild and pack
    - equivalent to `npm run nuke && npm run build:all`

#### test

  * `test` - executes an automated test
    - note this is more of an "integration" than "unit" test: it validates the end-to-end functionality of the packaged module using the `./examples` sub-modules

  * `nuke:test` - force a full refresh, rebuild, repack and then test
    - equivalent to `npm run nuke:build && npm run test`

#### dep

  * `dep:clean` - remove duplicate or extraneous third-party dependencies from `node_modules`; alias for `clean:dep`

  * `dep:safe-upgrade` - refresh all dependencies to the latest version compatible with the specified semver specified in `package.json`

  * `dep:outdated` - list any potentially outdated or upgradeable dependencies

  * `dep:outdated:fix` - interactively update any outdated or upgradeable dependencies; modifying `package.json` and re-installing as necessary

## Directory Structure

  * [`src/`](https://github.com/rodw/esbuild-peggy/tree/develop/src) - *original source code for production build artifacts*
  * [`scripts/`](https://github.com/rodw/esbuild-peggy/tree/develop/scripts/) - *build scripts*
  * [`examples/`](https://github.com/rodw/esbuild-peggy/tree/develop/examples/) - *sub-modules demonstrating how to use the plug-in*
  * `target/` - *a local (non-repository) directory containing generated build artifacts*

## Branching Policy

This repository follows a simplified version of [the gitflow branching model](https://nvie.com/posts/a-successful-git-branching-model/#the-main-branches).

Notably:

1. The [`main` branch](https://github.com/rodw/esbuild-peggy/tree/main) contains the version history for the stable, production releases of the module, with a [tag](https://github.com/rodw/esbuild-peggy/tags) marking each named (numbered) release.

2. The [`develop` branch](https://github.com/rodw/esbuild-peggy/tree/develop) contains the work-in-progress, integration version of the code, which is merged into the `main` branch as part of the release process. All pull requests should be submitted against the `develop` branch.

## How to contribute

Your contributions, [bug reports](https://github.com/rodw/esbuild-peggy/issues) and [pull-requests](https://github.com/rodw/esbuild-peggy/pulls) are greatly appreciated.

We're happy to accept any help you can offer, but the following
guidelines can help streamline the process for everyone.

 * You can report any bugs at
   [github.com/rodw/esbuild-peggy/issues](https://github.com/rodw/esbuild-peggy/issues).

    - We'll be able to address the issue more easily if you can
      provide an demonstration of the problem you are
      encountering. The best format for this demonstration is a
      failing unit test, but your report is welcome with or without that.

 * Our preferred channel for contributions or changes to the
   source code and documentation is as a git "patch" or "pull-request".

    - If you've never submitted a pull-request, here's one way to go
      about it:

        1. Fork or clone the repository.
        2. Create a local branch to contain your changes (`git checkout -b my-new-branch`).
        3. Make your changes and commit them to your local repository.
        4. Create a pull request [as described here](https://help.github.com/articles/creating-a-pull-request).

    - If you'd rather use a private (or just non-GitHub) repository,
      you might find
      [these generic instructions on creating a "patch" with Git](https://ariejan.net/2009/10/26/how-to-create-and-apply-a-patch-with-git/)
      helpful.

 * If you are making changes to the code please ensure that the
   test suite (invoked via `npm test`) still passes.

 * If you are making changes to the code to address a bug or introduce
   new features, we'd *greatly* appreciate it if you can provide one
   or more tests that demonstrate the bug or
   exercise the new feature.

 * When you submit a pull request or issue to this repository, your contributions are understood to be made available under the same available the [MIT License](https://github.com/rodw/esbuild-peggy/blob/develop/LICENSE.txt) that covers this project.

 * We are more than happy to acknowledge your contributions both in the source repository and within the released module. Please feel free to request or directly submit changes to the [AUTHORS.txt](https://github.com/rodw/esbuild-peggy/blob/develop/AUTHORS.txt) and/or [CONTRIBUTORS.txt](https://github.com/rodw/esbuild-peggy/blob/develop/CONTRIBUTORS.txt) acknowledgement files together with your pull request.
