import { checkAuthService } from "../../services/hubspot";
import { ContextData, Settings } from "../../types";
import { createSearchParams, useNavigate } from "react-router-dom";
import { getAccessToken } from "../../services/hubspot/";
import { getEntityContactList } from "../../services/entityAssociation";
import { OAuth2Result, useDeskproLatestAppContext, useInitialisedDeskproAppClient } from "@deskpro/app-sdk";
import { placeholders } from "../../services/hubspot/constants";
import { tryToLinkAutomatically } from "../../utils";
import { useCallback, useState } from "react";
import { useLinkContact, useLinkUnlinkNote } from "../../hooks";

interface UseLogin {
    onSignIn: () => void,
    authUrl: string | null,
    error: null | string,
    isLoading: boolean,
};

export default function useLogin(): UseLogin {
    const [authUrl, setAuthUrl] = useState<string | null>(null)
    const [error, setError] = useState<null | string>(null)
    const [isLoading, setIsLoading] = useState(false)
    const navigate = useNavigate()

    const { linkContactFn } = useLinkUnlinkNote();
    const { getContactInfo } = useLinkContact();

    const { context } = useDeskproLatestAppContext<ContextData, Settings>()

    const user = context?.data?.user


    // TODO: Update useInitialisedDeskproAppClient typing in the
    // App SDK to to properly handle both async and sync functions

    // eslint-disable-next-line @typescript-eslint/no-misused-promises
    useInitialisedDeskproAppClient(async (client) => {
        if (context?.settings.use_deskpro_saas === undefined || !user) {
            // Make sure settings have loaded.
            return
        }

        // Ensure they aren't using access tokens
        if (context.settings.use_api_token === true) {
            setError("Enable OAuth to access this page");
            return
        }

        const mode = context?.settings.use_deskpro_saas ? 'global' : 'local';

        const clientId = context?.settings.client_id;
        if (mode === 'local' && typeof clientId !== 'string') {
            // Local mode requires a clientId.
            setError("A client ID is required");
            return
        }

        const oauth2 = mode === "local" ?
            await client.startOauth2Local(
                ({ state, callbackUrl }) => {
                    return `https://app.hubspot.com/oauth/authorize?${createSearchParams([
                        ["response_type", "code"],
                        ["client_id", clientId ?? ""],
                        ["redirect_uri", callbackUrl],
                        ["scope", "account-info.security.read crm.objects.companies.read crm.objects.contacts.read crm.objects.contacts.write crm.objects.deals.read crm.objects.deals.write crm.objects.owners.read files oauth sales-email-read"],
                        ["state", state],
                    ]).toString()}`;
                },
                /\bcode=(?<code>[^&#]+)/,
                async (code: string): Promise<OAuth2Result> => {
                    // Extract the callback URL from the authorization URL
                    const url = new URL(oauth2.authorizationUrl);
                    const redirectUri = url.searchParams.get("redirect_uri");

                    if (!redirectUri) {
                        throw new Error("Failed to get callback URL");
                    }

                    const data = await getAccessToken(client, { code, callbackURL: redirectUri });

                    return { data }
                }
            )
            // Global Proxy Service
            : await client.startOauth2Global("TW2mwcHyQwCmkrzNjgdMAQ");

        setAuthUrl(oauth2.authorizationUrl)
        setIsLoading(false)

        try {
            const result = await oauth2.poll()

            await client.setUserState(placeholders.OAUTH2_ACCESS_TOKEN_PATH, result.data.access_token, { backend: true })

            if (result.data.refresh_token) {
                await client.setUserState(placeholders.OAUTH2_REFRESH_TOKEN_PATH, result.data.refresh_token, { backend: true })
            }

            try {
                await checkAuthService(client)
            } catch {
                throw new Error("Error authenticating user")
            }

            tryToLinkAutomatically(client, user, getContactInfo, linkContactFn)
                .then(() => getEntityContactList(client, user.id))
                .then((entityIds) => navigate(entityIds.length > 0 ? "/home" : "/link"))
                .catch(() => { navigate("/link") });


        } catch (error) {
            setError(error instanceof Error ? error.message : 'Unknown error');
            setIsLoading(false);
        }
    }, [setAuthUrl, context?.settings.use_deskpro_saas])

    const onSignIn = useCallback(() => {
        setIsLoading(true);
        window.open(authUrl ?? "", '_blank');
    }, [setIsLoading, authUrl]);


    return { authUrl, onSignIn, error, isLoading }

}