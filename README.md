# Partytown plugin for Fresh

Partytown integration for Fresh in two steps:

1. Include this plugin in your Fresh config
2. Use the custom `<Script />` component to offload the script execution to
   partytown

This plugin was heavily inspired in
[Gatsby's Script tag](https://www.gatsbyjs.com/docs/reference/built-in-components/gatsby-script/)

## Usage

Add the partytown plugin to your fresh configuration by:

```ts
import { start } from "$fresh/server.ts";
import manifest from "./fresh.gen.ts";
import partytownPlugin from "https://deno.land/x/partytown/mod.t";

await start(manifest, {
  plugins: [
    await partytownPlugin(),
  ],
});
```

This will copy partytown files to `/static/~partytown` and setup the partytown
plugin for you.

Now, import the `<Script />` component from
`https://deno.land/x/partytown/Script.tsx` and use it for offloading script
execution to partytown wokers.

For instance, for offloading Google Tag Manager execution to Partytown, create a
`/routes/_app.tsx` file in your fresh project and add the following code:

```tsx
import { AppProps } from "$fresh/server.ts";
import Script from "https://deno.land/x/partytown/Script.tsx";

export default function App(props: AppProps) {
  return (
    <>
      <Script src={`https://www.googletagmanager.com/gtag/js?id=${trackingId}`}/>
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

      <props.Component />
    </>
  );
}
```

This will offload script execution to partytown. 

## Forward collection
This plugin will collect all `<Script/>` components rendered on a page, and automatically merge any Partytown forwarded events defined via the forward property into a single configuration for each page:

```tsx
<Script forward={["gtag"]} src={`https://www.googletagmanager.com/gtag/js?id=${trackingId}`}/>
```

The forward property is the only Partytown-specific property that is handled by the `<Script/>` component.

## First-party integrations
This plugin also brings some out-of-the-box integrations for common services. To use them:
```tsx
// /routes/_app.tsx
import { AppProps } from "$fresh/server.ts";
import GoogleTagManager from "https://deno.land/x/partytown/integrations/GoogleTagManager.tsx";

export default function App(props: AppProps) {
  return (
    <>
      <GoogleTagManager trackingId="GA-1231231" />

      <props.Component />
    </>
  );
}
```

Take a look at the [integrations](https://deno.land/x/partytown/integrations) folder for all available options.