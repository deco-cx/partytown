import Script from "../Script.tsx";

interface Props {
  trackingId: string;
}

const GoogleTagManager = ({ trackingId = "" }: Props) => {
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
      />
    </>
  );
};

export default GoogleTagManager;
