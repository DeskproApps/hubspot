import { checkAuthService } from "../../services/hubspot";
import { ContextData, Settings } from "../../types";
import { createSearchParams, useNavigate } from "react-router-dom";
import { getAccessToken } from "../../services/hubspot/";
import { getEntityContactList } from "../../services/entityAssociation";
import { IOAuth2, OAuth2Result, useDeskproLatestAppContext, useInitialisedDeskproAppClient } from "@deskpro/app-sdk";
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
    const [isPolling, setIsPolling] = useState(false)
    const [oauth2Context, setOAuth2Context] = useState<IOAuth2 | null>(null)

    const navigate = useNavigate()

    const { linkContactFn } = useLinkUnlinkNote();
    const { getContactInfo } = useLinkContact();

    const { context } = useDeskproLatestAppContext<ContextData, Settings>()

    const user = context?.data?.user
    const isUsingOAuth = context?.settings.use_api_token === false || context?.settings.use_advanced_connect === false;

    // TODO: Update useInitialisedDeskproAppClient typing in the
    // App SDK to to properly handle both async and sync functions

    // eslint-disable-next-line @typescript-eslint/no-misused-promises
    useInitialisedDeskproAppClient(async (client) => {
        if (!user) {
            // Make sure settings have loaded.
            return
        }

        // Ensure they aren't using access tokens
        if (!isUsingOAuth) {
            setError("Enable OAuth to access this page");
            return
        }

        const mode = context?.settings.use_advanced_connect === false ? 'global' : 'local';

        const clientId = context?.settings.client_id;
        if (mode === 'local' && typeof clientId !== 'string') {
            // Local mode requires a clientId.
            setError("A client ID is required");
            return
        }

        const oauth2Response = mode === "local" ?
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
                    const url = new URL(oauth2Response.authorizationUrl);
                    const redirectUri = url.searchParams.get("redirect_uri");

                    if (!redirectUri) {
                        throw new Error("Failed to get callback URL");
                    }

                    const data = await getAccessToken(client, { code, callbackURL: redirectUri });

                    return { data }
                }
            )
            // Global Proxy Service
            : await client.startOauth2Global("0c24a533-90fe-4f5d-8882-ada7e3bfeed1");

        setAuthUrl(oauth2Response.authorizationUrl)
        setOAuth2Context(oauth2Response)

    }, [setAuthUrl, context?.settings.use_advanced_connect])


    useInitialisedDeskproAppClient((client) => {
        if (!user || !oauth2Context) {
            return
        }

        const startPolling = async () => {
            try {
                const result = await oauth2Context.poll()

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
            } finally {
                setIsLoading(false)
                setIsPolling(false)
            }
        }

        if (isPolling) {
            void startPolling()
        }
    }, [isPolling, user, oauth2Context, navigate])


    const onSignIn = useCallback(() => {
        setIsLoading(true);
        setIsPolling(true);
        window.open(authUrl ?? "", '_blank');
    }, [setIsLoading, authUrl]);


    return { authUrl, onSignIn, error, isLoading }

}