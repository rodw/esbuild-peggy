import fs from "node:fs/promises";
import peg from "peggy";
import type { Plugin, PluginBuild, OnLoadArgs, OnLoadResult } from "esbuild";

const PLUGIN_NAME = "pegjs-loader";
const PLUGIN_NAMESPACE = "file";
const FILTER_REGEX = /\.peg(js|gy)$/;

export type PeggyPluginOptions = peg.ParserOptions;

export const peggyPlugin = (initialOptions: PeggyPluginOptions = {}): Plugin => ({
  name: PLUGIN_NAME,
  setup(build: PluginBuild) {
    build.onLoad({ filter: FILTER_REGEX, namespace: PLUGIN_NAMESPACE }, async (args: OnLoadArgs): Promise<OnLoadResult> => {
      const source = await fs.readFile(args.path, "utf8");
      const pegOptions: peg.ParserOptions = {
        output: "source",
        ...initialOptions,
      };
      try {
        const contents = peg.generate(source, pegOptions);
        return {
          contents: `export default ${contents}`
        };
      } catch (genericErr) {
        if (genericErr != null && genericErr instanceof peg.GrammarError) {
          const err = genericErr as peg.GrammarError;
          return {
            errors: [
              {
                text: err?.message,
                location: {
                  file: args.path,
                  line: err?.location?.start?.line ?? 0,
                  column: (err?.location?.start?.column ?? 1) - 1,
                  length: (err?.location?.end?.offset ?? 1) - (err?.location?.start?.offset ?? 0),
                  lineText: source.split("\n").slice(err?.location?.start?.line ?? 1 - 1, err?.location?.start?.line).join("\n"),
                }
              }
            ]
          }
        } else {
          throw genericErr;
        }
      }
    });
  }
});
