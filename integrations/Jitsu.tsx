import Script from "../Script.tsx";

import type { ComponentProps } from "preact";

interface Props extends ComponentProps<typeof Script> {
  "data-key": string;
  "data-init-only"?: "true" | "false";
}

declare global {
  interface Window {
    jitsu: (...args: unknown[]) => void;
    jitsuQ: unknown[];
  }
}

function snippet() {
  window.jitsu = window.jitsu || (function () {
    (window.jitsuQ = window.jitsuQ || []).push(arguments);
  });
}

const Jitsu = (props: Props) => (
  <>
    <Script
      id={`jitsu-script-${props["data-key"]}`}
      forward={["jitsu"]}
      src="https://t.jitsu.com/s/lib.js"
      {...props}
    />
    {/* Jitsu Doc snippet */}
    <Script
      id={`jitsu-script-global-${props["data-key"]}`}
      dangerouslySetInnerHTML={{ __html: `(${snippet})();` }}
    >
    </Script>
  </>
);

export default Jitsu;
