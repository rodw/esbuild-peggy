import fs from "node:fs";
import path from "node:path";
import type { Plugin, PluginBuild } from "esbuild";

const PLUGIN_NAME = "make-package-json";
const DEFAULT_OUTFILE = "package.json";
const DEFAULT_OUTDIR = "dist";
const DEFAULT_ALLOW_OVERWRITE = false;

export interface PackageJson extends Record<string, unknown> {
}

export interface MakePackageJsonOptions {
  readonly contents: PackageJson;
  readonly outfile?: string;
  readonly allowOverwrite?: boolean;
}

function resolveOutfile(pluginOptsOutfile?: string, esbuildOptsOutdir?: string, esbuildOptsOutfile?: string): string {
  const outfile = pluginOptsOutfile ?? DEFAULT_OUTFILE;
  const outdir = esbuildOptsOutdir ?? (esbuildOptsOutfile ? path.dirname(esbuildOptsOutfile) : DEFAULT_OUTDIR);
  return path.resolve(outdir, outfile);
}

function resolveAllowOverwrite(pluginOptsAllowOverwrite?: boolean, esbuildOptsAllowOverwrite?: boolean): boolean {
  return pluginOptsAllowOverwrite ?? esbuildOptsAllowOverwrite ?? DEFAULT_ALLOW_OVERWRITE;
}

async function isFile(filename: string): Promise<boolean> {
  return (await fs.promises.stat(filename)).isFile();
}

function relativeToCwd(filename: string): string {
  return path.relative(".", filename);
}

async function mkdirp(dir: string): Promise<void> {
  if (!fs.existsSync(dir)) {
    await fs.promises.mkdir(dir, { recursive: true });
  }
}

function stringifyContents(contents: Partial<PackageJson>): string {
  return JSON.stringify(contents, null, 2) + "\n";
}

export const makePackageJson = (pluginOptions: MakePackageJsonOptions): Plugin => {
  return {
    name: PLUGIN_NAME,
    setup(build: PluginBuild) {
      build.onStart(async (): Promise<void> => {
        const esbuildOptions = build?.initialOptions;
        const dest = resolveOutfile(pluginOptions?.outfile, esbuildOptions?.outdir, esbuildOptions?.outfile);
        const allowOverwrite = resolveAllowOverwrite(pluginOptions?.allowOverwrite, esbuildOptions?.allowOverwrite);
        const stringifiedContents = stringifyContents(pluginOptions?.contents ?? {});
        if (fs.existsSync(dest)) {
          if (!allowOverwrite) {
            throw new Error(`Destination file ${relativeToCwd(dest)} already exists; set allowOverwrite to force overwrite.`);
          } else if (!await isFile(dest)) {
            throw new Error(`Destination file ${relativeToCwd(dest)} is not a regular file; cannot be overwritten.`);
          }
        }
        await mkdirp(path.dirname(dest));
        return fs.promises.writeFile(dest, stringifiedContents, "utf8");
      });
    }
  }
}
