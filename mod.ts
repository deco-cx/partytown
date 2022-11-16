import { Plugin } from "$fresh/server.ts";

import { partytownSnippet } from "https://esm.sh/@builder.io/partytown@0.7.1/integration";

import { copyLibFiles } from "./copyFiles.ts";
import { storage } from "./shared.ts";

interface Options {
  copyFiles?: boolean;
}

const partytown = async (
  { copyFiles }: Options = {},
): Promise<Plugin> => {
  if (copyFiles !== false) {
    await copyLibFiles();
  }

  return {
    name: "partytown",
    entrypoints: {
      "main": `data:application/javascript,export default function(state){
      window.forward = JSON.stringify(state);
      ${partytownSnippet()}}`,
    },
    render(ctx) {
      storage.forward = [];

      ctx.render();

      return {
        scripts: [{ entrypoint: "main", state: storage }],
      };
    },
  };
};

export default partytown;
