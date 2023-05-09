import { Plugin } from "$fresh/server.ts";

import {
  PartytownConfig,
  partytownSnippet,
} from "https://esm.sh/@builder.io/partytown@0.8.0/integration";

import { copyLibFiles } from "./copyFiles.ts";
import { clearForward, readForward } from "./shared.ts";

interface Options {
  copyFiles?: boolean;
}

declare global {
  interface Window {
    partytown: PartytownConfig;
  }
}

function snippet(state: PartytownConfig) {
  const params = new URLSearchParams(window.location.search);

  const getState = (): PartytownConfig => {
    if (params.has("disablePartytown") || params.has("gtm_debug")) {
      console.debug("🎉 Running partytown scripts on main thread");

      document
        .querySelectorAll('script[type="text/partytown"]')
        .forEach((node) => {
          node.remove();
          node.setAttribute("type", "text/javascript");
          document.body.appendChild(node);
        });

      return {
        ...state,
        forward: undefined,
      };
    }

    if (params.has("debugPartytown")) {
      return {
        ...state,
        debug: true,
      };
    }

    return state;
  };

  window.partytown = getState();
}

const partytown = (
  { copyFiles }: Options = {},
): Plugin => {
  if (copyFiles !== false) {
    copyLibFiles().catch(console.error);
  }

  return {
    name: "partytown",
    entrypoints: {
      "main": `data:application/javascript,export default function(state){
      (${snippet})(state);
      ${partytownSnippet()}
    }`,
    },
    render(ctx) {
      clearForward();
      ctx.render();

      return {
        scripts: [{ entrypoint: "main", state: readForward() }],
      };
    },
  };
};

export default partytown;
