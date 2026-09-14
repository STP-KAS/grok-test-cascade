import { existsSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";

const here = dirname(fileURLToPath(import.meta.url));

function root(): string {
  const fromEnv = process.env.KASCADE_ROOT;
  if (fromEnv && existsSync(fromEnv)) return fromEnv;
  const cloned = join(here, "..", "..", "..", "grok-test-cascade-work", "kascade");
  if (existsSync(cloned)) return cloned;
  const bundled = join(here, "..", "node_modules", "kascade");
  if (existsSync(bundled)) return bundled;
  throw new Error("kascade source not found; set KASCADE_ROOT or npm install");
}

export async function loadKascade() {
  const r = root();
  const [manifest, consumer, fountMod] = await Promise.all([
    import(pathToFileURL(join(r, "src/manifest.ts")).href),
    import(pathToFileURL(join(r, "src/consumer.ts")).href),
    import(pathToFileURL(join(r, "src/fount.ts")).href),
  ]);
  return {
    buildManifest: manifest.buildManifest,
    fetchFile: consumer.fetchFile,
    fount: fountMod.fount,
  };
}
