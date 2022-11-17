import Script from "../Script.tsx";

interface Props {
  "data-key": string;
}

const snippet =
  `window.jitsu = window.jitsu || (function(){(window.jitsuQ = window.jitsuQ || []).push(arguments);})`;

const Jitsu = (props: Props) => {
  return (
    <>
      <Script
        forward={["jitsu"]}
        data-key={props["data-key"]}
        src="https://t.jitsu.com/s/lib.js"
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
