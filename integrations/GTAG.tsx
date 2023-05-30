import Script from "../Script.tsx";

interface Props {
  trackingId: string;
  dangerouslyRunOnMainThread?: boolean;
}

declare global {
  interface Window {
    gtag: (...args: unknown[]) => void;
  }
}

function snippet(trackingId: string) {
  // It is safe to .push in datalayer in here because partytown have already
  // run and made dataLayer.push available in window
  window.gtag = window.gtag || function () {
    window.dataLayer.push(arguments);
  };

  function init() {
    window.gtag("js", new Date());
    window.gtag("config", trackingId);
  }

  if (document.readyState === "complete") {
    init();
  } else {
    addEventListener("load", init);
  }
}

const GoogleTagManager = (
  { trackingId = "", dangerouslyRunOnMainThread = false }: Props,
) => (
  <>
    <Script
      id={`gtag-script-${trackingId}`}
      forward={["dataLayer.push"]}
      type={dangerouslyRunOnMainThread ? "text/javascript" : undefined}
      src={`https://www.googletagmanager.com/gtag/js?id=${trackingId}`}
    />
    <Script
      id={`gtag-script-global-${trackingId}`}
      type="module"
      dangerouslySetInnerHTML={{
        __html: `(${snippet})(${trackingId});`,
      }}
    />
  </>
);

export default GoogleTagManager;
