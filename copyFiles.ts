import {
  ensureDirSync,
  existsSync,
} from "https://deno.land/std@0.164.0/fs/mod.ts";
import { join } from "https://deno.land/std@0.164.0/path/mod.ts";

const partytownUrlPrefix = "https://unpkg.com/@builder.io/partytown@0/lib/";
const partytownFiles = [
  "partytown.js",
  "partytown-sw.js",
  "partytown-media.js",
  "partytown-atomics.js",
];
const partytownDebugFiles = [
  ...partytownFiles.map((filename) => `/debug/${filename}`),
  "/debug/partytown-sandbox-sw.js",
  "/debug/partytown-ww-atomics.js",
  "/debug/partytown-ww-sw.js",
];

async function fetchAndWriteFiles(files: string[], dest: string) {
  const unpkFiles = await Promise.all(
    files.map((file) =>
      fetch(`${partytownUrlPrefix}/${file}`).then((res) => res.text())
    ),
  );

  files.forEach((fileName, index) => {
    Deno.writeTextFileSync(
      join(dest, fileName),
      unpkFiles[index],
      { create: true },
    );
  });
}

export async function copyLibFiles() {
  const fullPathDest = join(Deno.cwd(), "static/~partytown");

  if (!existsSync(fullPathDest)) {
    ensureDirSync(fullPathDest);

    await fetchAndWriteFiles(partytownFiles, fullPathDest);
  }

  const debugFolder = join(fullPathDest, "./debug/");
  if (!existsSync(debugFolder)) {
    ensureDirSync(debugFolder);

    await fetchAndWriteFiles(partytownDebugFiles, fullPathDest);
  }
}
