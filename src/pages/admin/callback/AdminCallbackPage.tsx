import { CopyToClipboardInput, IOAuth2, LoadingSpinner, OAuth2Result, useInitialisedDeskproAppClient } from "@deskpro/app-sdk";
import { createSearchParams } from "react-router-dom";
import { DeskproTheme, P1 } from "@deskpro/deskpro-ui";
import { useState } from "react";
import styled from "styled-components";
import type { FC } from "react";

interface ThemeProps {
  theme: DeskproTheme;
}

const Description = styled(P1) <ThemeProps>`
  margin-top: 8px;
  margin-bottom: 16px;
  color: ${({ theme }: ThemeProps) => theme.colors.grey80};
`;

const AdminCallbackPage: FC = () => {
  const [callbackUrl, setCallbackUrl] = useState<string | null>(null)

  // TODO: Update useInitialisedDeskproAppClient typing in the
  // App SDK to to properly handle both async and sync functions
  
  // eslint-disable-next-line @typescript-eslint/no-misused-promises
  useInitialisedDeskproAppClient(async (client) => {
    const oauth2: IOAuth2 = await client.startOauth2Local(
      ({ callbackUrl, state }: { callbackUrl: string; state: string }) => {
        return `https://app.hubspot.com/oauth/authorize?${createSearchParams([
          ["response_type", "code"],
          ["client_id", "xxx"],
          ["state", state],
          ["redirect_uri", callbackUrl],
          ["scope", "xxx"],
        ]).toString()}`;
      },
      /code=(?<code>[0-9a-f]+)/,
      // Disabling eslint here because the function does not perform any asynchronous operations
      // and we don't need to await anything
      // eslint-disable-next-line @typescript-eslint/require-await
      async (): Promise<OAuth2Result> => {
        return { data: { access_token: "", refresh_token: "" } };
      }
    );

    const url = new URL(oauth2.authorizationUrl);
    const redirectUri = url.searchParams.get("redirect_uri")

    if (redirectUri) {
      setCallbackUrl(redirectUri)
    }
  }, [])

  if (!callbackUrl) {
    return (<LoadingSpinner />)
  }

  return (
    <>
      <CopyToClipboardInput value={callbackUrl} />
      <Description>The callback URL will be required during the HubSpot app setup</Description>
    </>
  );
};

export default AdminCallbackPage
