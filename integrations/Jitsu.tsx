import Script from "../Script.tsx";

interface Props {
  "data-key": string;
  "data-init-only"?: boolean;
}

const snippet =
  `window.jitsu = window.jitsu || (function(){(window.jitsuQ = window.jitsuQ || []).push(arguments);})`;

const Jitsu = (props: Props) => {
  return (
    <>
      <Script
        forward={["jitsu"]}
        src="https://t.jitsu.com/s/lib.js"
        {...props}
      />
      <Script
        type="application/javascript"
        dangerouslySetInnerHTML={{
          __html: snippet,
        }}
      />
    </>
  );
};

export default Jitsu;
