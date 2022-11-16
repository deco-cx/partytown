import Script from "../Script.tsx";

interface Props {
  "data-key": string;
}

const Jitsu = (props: Props) => {
  return (
    <>
      <Script
        data-key={props["data-key"]}
        src="https://t.jitsu.com/s/lib.js"
      />
      <Script
        forward={["jitsu"]}
        dangerouslySetInnerHTML={{
          __html:
            `window.jitsu = window.jitsu || (function(){(window.jitsuQ = window.jitsuQ || []).push(arguments);})`,
        }}
      >
      </Script>
    </>
  );
};

export default Jitsu;
