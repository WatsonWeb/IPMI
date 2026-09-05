import path from "node:path";
import type { Plugin, ResolvedConfig } from "vite-plus";

import { compileAllStylesheets, compileStylesheet, stylesheetEntries } from "./compile-styles.ts";

const stylesByPath = new Map(Object.keys(stylesheetEntries).map((name) => [`/${name}.css`, name]));
export interface AssetOutputConfig {
  root: string;
  publicDir: string | false;
  build: { outDir: string; emptyOutDir?: boolean | null; copyPublicDir?: boolean };
}

export function assertSafeAssetOutput(config: AssetOutputConfig): void {
  if (path.resolve(config.root, config.build.outDir) !== path.join(config.root, "dist")) {
    throw new Error(
      "IPMI builds must write to the project's dist directory, never the published root assets.",
    );
  }
  if (
    config.build.emptyOutDir !== false ||
    config.build.copyPublicDir !== false ||
    (config.publicDir !== false && config.publicDir !== "")
  ) {
    throw new Error(
      "IPMI asset builds require emptyOutDir:false, copyPublicDir:false, and publicDir:false.",
    );
  }
}

export function webflowAssetsPlugin(): Plugin {
  let config: ResolvedConfig;
  const dependencies = new Set<string>();
  return {
    name: "ipmi-webflow-styles",
    configResolved(resolved) {
      config = resolved;
    },
    async buildStart() {
      if (config.command !== "build") return;
      assertSafeAssetOutput({ ...config, build: this.environment.config.build });
      if (this.environment.name !== "client") return;
      for (const compilation of await compileAllStylesheets(config.root)) {
        for (const file of compilation.dependencies) this.addWatchFile(file);
        this.emitFile({ type: "asset", fileName: compilation.fileName, source: compilation.css });
      }
    },
    configureServer(server) {
      server.middlewares.use(async (request, response, next) => {
        const name = stylesByPath.get(new URL(request.url ?? "/", "http://localhost").pathname);
        if (!name || !["GET", "HEAD"].includes(request.method ?? "GET")) return next();
        try {
          const compilation = await compileStylesheet(name, config.root);
          for (const file of compilation.dependencies) {
            dependencies.add(path.resolve(file));
            server.watcher.add(file);
          }
          response.setHeader("Content-Type", "text/css; charset=utf-8");
          response.setHeader("Cache-Control", "no-store");
          response.end(request.method === "HEAD" ? undefined : compilation.css);
        } catch (error) {
          server.config.logger.error(error instanceof Error ? error.message : String(error));
          response.statusCode = 500;
          response.end(
            request.method === "HEAD"
              ? undefined
              : "Stylesheet compilation failed; see the Vite terminal.",
          );
        }
      });
    },
    handleHotUpdate({ file, server }) {
      if (dependencies.has(path.resolve(file))) {
        server.ws.send({ type: "full-reload", path: "*" });
        return [];
      }
      // TypeScript dependencies use Vite's native module graph/reload handling.
    },
  };
}
