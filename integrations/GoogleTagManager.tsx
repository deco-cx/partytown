import { Script } from "../Script.tsx";

export const GoogleTagManager = (
  { trackingId = "" }: { trackingId: string },
) => {
  return (
    <>
      <Script
        src={`https://www.googletagmanager.com/gtag/js?id=${trackingId}`}
      />
      <Script
        forward={["gtag"]}
        dangerouslySetInnerHTML={{
          __html: `
        window.dataLayer = window.dataLayer || [];
        function gtag() {
          window.dataLayer.push(arguments);
        }
        window.gtag = gtag;
        window.gtag("js", new Date());
        window.gtag("config", "${trackingId}");
      `,
        }}
      >
      </Script>
    </>
  );
};
