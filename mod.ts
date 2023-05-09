import { Plugin } from "$fresh/server.ts";

import {
  PartytownConfig,
  partytownSnippet,
} from "https://esm.sh/@builder.io/partytown@0.8.0/integration";

import { copyLibFiles } from "./copyFiles.ts";
import { clearForward, readForward } from "./shared.ts";

interface Options {
  copyFiles?: boolean;
  proxyUrl?: string;
}

declare global {
  interface Window {
    partytown: PartytownConfig;
    ptProxyUrl?: string;
  }
}

function snippet(state: PartytownConfig) {
  const params = new URLSearchParams(window.location.search);
  const disabled = localStorage?.getItem("disablePartytown");

  const getState = (): PartytownConfig => {
    if (params.has("disablePartytown") || params.has("gtm_debug") || disabled) {
      console.debug("🎉 Running partytown scripts on main thread");

      
      document
      .querySelectorAll('script[type="text/partytown"]')
      .forEach((node) => {
        node.remove();
        node.setAttribute("type", "text/javascript");
        document.body.appendChild(node);
      });
      
      localStorage?.setItem("disablePartytown", "true");
      console.log('Disabling partytown. To enable it again, run: localStorage.setItem("disablePartytown", "")')

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
  { copyFiles, proxyUrl }: Options = {},
): Plugin => {
  if (copyFiles !== false) {
    copyLibFiles().catch(console.error);
  }

  return {
    name: "partytown",
    entrypoints: {
      "main": `data:application/javascript,export default function(state){
      (${snippet})(state);
      window.partytown.resolveUrl = function (url, location, type) {
        const proxyUrl = ${proxyUrl ? `'${proxyUrl}'` : 'undefined'};

        if (!proxyUrl) { return url}
        console.log({ proxyUrl });

        if (url.href.includes(proxyUrl)) {
          return url;
        }
        if (type === "script" && proxyUrl) {
          const finalProxyUrl = new URL(location.origin + proxyUrl);
          finalProxyUrl.searchParams.append("url", url.href);
          return finalProxyUrl;
        }
        return url;
      };
      ${partytownSnippet()}
    }`,
    },
    render(ctx) {
      clearForward();
      ctx.render();
      return {
        scripts: [{
          entrypoint: "main",
          state: { ...readForward(), proxyUrl },
        }],
      };
    },
  };
};

export default partytown;
