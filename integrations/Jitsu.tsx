import { Script } from "../Script.tsx";

export const Jitsu = (props: { "data-key": string }) => {
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
