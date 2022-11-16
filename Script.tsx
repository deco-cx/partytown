import { Head } from "$fresh/runtime.ts";
import { JSX } from "preact";
import { storage } from "./shared.ts";

interface Props extends JSX.HTMLAttributes<HTMLScriptElement> {
  forward?: string[];
}

const Script = ({
  forward = [],
  ...scriptProps
}: Props) => {
  storage.forward = [
    ...storage.forward,
    ...forward,
  ];

  return (
    <Head>
      <script type="text/partytown" {...scriptProps} />
    </Head>
  );
};

export default Script;
