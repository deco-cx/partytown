import Script from "../Script.tsx";

interface Props {
  trackingId: string;
}

const snippet = () => `
// It is safe to .push in datalayer in here because partytown have already
// run and made dataLayer.push available in window
function init() {
  window.dataLayer.push({'gtm.start':new Date().getTime(), event:'gtm.js'});
}

if (document.readyState === 'complete') {
  init();
} else {
  window.addEventListener('load', init);
};
          
`;

const GoogleTagManager = ({ trackingId = "" }: Props) => (
  <>
    <Script
      forward={["dataLayer.push"]}
      src={`https://www.googletagmanager.com/gtm.js?id=${trackingId}`}
    />
    <Script
      type="application/javascript"
      dangerouslySetInnerHTML={{
        __html: snippet(),
      }}
    />
  </>
);

export default GoogleTagManager;
