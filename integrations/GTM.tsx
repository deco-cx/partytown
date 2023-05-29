import Script from "../Script.tsx";

interface Hosted {
  trackingId: string;
}

interface OnPremises {
  src: string;
}

type Props = Hosted | OnPremises;

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

const isOnPremises = (props: Props): props is OnPremises =>
  Boolean((props as any).src);

const GoogleTagManager = (props: Props) => {
  const id = isOnPremises(props) ? props.src : props.trackingId;
  const src = isOnPremises(props)
    ? props.src
    : `https://www.googletagmanager.com/gtm.js?id=${props.trackingId}`;

  return (
    <>
      <Script id={`gtm-script-${id}`} forward={["dataLayer.push"]} src={src} />
      <Script
        id={`gtm-script-global-${id}`}
        type="module"
        dangerouslySetInnerHTML={{ __html: `(${snippet})();` }}
      />
    </>
  );
};

export default GoogleTagManager;
