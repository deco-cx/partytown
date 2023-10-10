import Script from "../Script.tsx";

interface Hosted {
  trackingId: string;
}

interface OnPremises {
  src: string;
}

type Props = (Hosted | OnPremises) & {
  dangerouslyRunOnMainThread?: boolean;
  /**
   * @description prevent forward to partytown
   */
  preventForward?: boolean;
};

declare global {
  interface Window {
    dataLayer: unknown[];
  }
}

function snippet() {
  window.dataLayer = window.dataLayer || [];

  // It is safe to .push in datalayer in here because partytown have already
  // run and made dataLayer.push available in window
  window.dataLayer.push({
    "gtm.start": new Date().getTime(),
    event: "gtm.js",
  });
}

const isOnPremises = (props: Props): props is OnPremises =>
  Boolean((props as any).src);

const GoogleTagManager = (props: Props) => {
  const id = isOnPremises(props) ? props.src : props.trackingId;
  const src = isOnPremises(props)
    ? props.src
    : `https://www.googletagmanager.com/gtm.js?id=${props.trackingId}`;
  const type = props.dangerouslyRunOnMainThread
    ? "text/javascript"
    : "text/partytown";

  return (
    <>
      <Script
        id={`gtm-script-${id}`}
        type={type}
        async={props.dangerouslyRunOnMainThread ? true : undefined}
        forward={props.dangerouslyRunOnMainThread || props.preventForward
          ? undefined
          : ["dataLayer.push"]}
        src={src}
      />
      <Script
        id={`gtm-script-global-${id}`}
        type={type}
        dangerouslySetInnerHTML={{ __html: `(${snippet})();` }}
      />
    </>
  );
};

export default GoogleTagManager;
