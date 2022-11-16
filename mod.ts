import { Plugin } from "$fresh/server.ts";

import { partytownSnippet } from "npm:@builder.io/partytown@0.7.0/integration";

import { storage } from "./shared.ts";

export default function partytown(): Plugin {
  const main = `data:application/javascript,export default function(state){
    window.forward = JSON.stringify(state);
    ${partytownSnippet()}}`;
    
  return {
    name: "partytown",
    entrypoints: { "main": main },
    render(ctx) {
      storage.forward = [];

      ctx.render();

      return {
        scripts: [{ entrypoint: "main", state: storage }],
      };
    },
  };
}
