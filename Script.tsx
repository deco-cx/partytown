import { Head } from "$fresh/runtime.ts";
import { JSX } from "preact";
import { collectForward } from "./shared.ts";

const TYPE_TEXT_PARTYTOWN = "text/partytown";

interface Props extends JSX.HTMLAttributes<HTMLScriptElement> {
  /**
   * add all strings at Partytown forward config, if type is `undefined` or `text/partytown`
   */
  forward?: string[];
}

const Script = ({
  forward = [],
  ...scriptProps
}: Props) => {
  const shouldCollect = scriptProps.type === undefined ||
    scriptProps.type === TYPE_TEXT_PARTYTOWN;

  if (shouldCollect) {
    collectForward(forward);
  }

  return (
    <Head>
      <script type={TYPE_TEXT_PARTYTOWN} {...scriptProps} />
    </Head>
  );
};

export default Script;
