import { Head } from "$fresh/runtime.ts";

import Script from "../Script.tsx";

interface Props {
  trackingId: string;
}

const snippet = (trackingId: string) => `
window.dataLayer = window.dataLayer || [];
function gtag() {
  window.dataLayer.push(arguments);
}
window.gtag = gtag;
window.gtag("js", new Date());
window.gtag("config", "${trackingId}");
`;

const GoogleTagManager = ({ trackingId = "" }: Props) => {
  return (
    <>
      <Script
        forward={["gtag"]}
        src={`https://www.googletagmanager.com/gtag/js?id=${trackingId}`}
      />
      <Script
        type="application/javascript"
        dangerouslySetInnerHTML={{
          __html: snippet(trackingId),
        }}
      />
    </>
  );
};

export default GoogleTagManager;
