import type { Plugin } from "esbuild";
import type { ParserOptions } from "peggy";
type PeggyPluginOptions = ParserOptions;
export declare const peggyPlugin: (options?: PeggyPluginOptions) => Plugin;
