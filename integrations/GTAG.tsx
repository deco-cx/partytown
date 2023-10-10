import Script from "../Script.tsx";

interface Props {
  trackingId: string;
  dangerouslyRunOnMainThread?: boolean;
  /**
   * @description prevent forward to partytown
   */
  preventForward?: boolean;
}

declare global {
  interface Window {
    gtag: (...args: unknown[]) => void;
  }
}

function snippet(trackingId: string) {
  window.dataLayer = window.dataLayer || [];
  window.gtag = window.gtag || function () {
    window.dataLayer.push(arguments);
  };
  window.gtag("js", new Date());
  window.gtag("config", trackingId);
}

const GoogleTagManager = (
  { trackingId = "", dangerouslyRunOnMainThread = false, preventForward }:
    Props,
) => {
  const type = dangerouslyRunOnMainThread
    ? "text/javascript"
    : "text/partytown";

  return (
    <>
      <Script
        id={`gtag-script-${trackingId}`}
        forward={dangerouslyRunOnMainThread || preventForward
          ? undefined
          : ["dataLayer.push"]}
        type={type}
        async={dangerouslyRunOnMainThread ? true : undefined}
        src={`https://www.googletagmanager.com/gtag/js?id=${trackingId}`}
      />
      <Script
        id={`gtag-script-global-${trackingId}`}
        type={type}
        dangerouslySetInnerHTML={{
          __html: `(${snippet})("${trackingId}");`,
        }}
      />
    </>
  );
};

export default GoogleTagManager;
