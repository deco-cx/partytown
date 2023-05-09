import Script from "../Script.tsx";

interface Props {
  trackingId: string;
}

declare global {
  interface Window {
    dataLayer: unknown[];
  }
}

function snippet() {
  window.dataLayer = window.dataLayer || [];

  // It is safe to .push in datalayer in here because partytown have already
  // run and made dataLayer.push available in window
  function init() {
    window.dataLayer.push({
      "gtm.start": new Date().getTime(),
      event: "gtm.js",
    });
  }

  if (document.readyState === "complete") {
    init();
  } else {
    addEventListener("load", init);
  }
}

const GoogleTagManager = ({ trackingId = "" }: Props) => (
  <>
    <Script
      id={`gtm-script-${trackingId}`}
      forward={["dataLayer.push"]}
      src={`https://www.googletagmanager.com/gtm.js?id=${trackingId}`}
    />
    <Script
      id={`gtm-script-global-${trackingId}`}
      type="module"
      dangerouslySetInnerHTML={{
        __html: `(${snippet})();`,
      }}
    />
  </>
);

export default GoogleTagManager;
