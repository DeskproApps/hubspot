import { useEffect, useMemo, useState } from "react";
import { v4 as uuidv4 } from "uuid";
import every from "lodash/every";
import {
    adminGenericProxyFetch,
    useDeskproAppClient,
    useDeskproAppEvents,
    useInitialisedDeskproAppClient
} from "@deskpro/app-sdk";
import { getAccessTokenInfoService } from "../../services/hubspot";
import { Settings, AuthTokens, AccessTokenInfo } from "../../services/hubspot/types";

export const useGlobalSignIn = () => {
    const { client } = useDeskproAppClient();
    const [ settings, setSettings ] = useState<Settings|null>(null);
    const [ callbackUrl, setCallbackUrl ] = useState<string|null>(null);
    const [ poll, setPoll ] = useState<(() => Promise<{ token: string }>)|null>(null);
    const [ isLoading, setIsLoading ] = useState<boolean>(false);
    const [ isBlocking, setIsBlocking ] = useState<boolean>(true);
    const [ accessCode, setAccessCode ] = useState<string|null>(null);
    const [ user, setUser ] = useState<AccessTokenInfo|null>(null);

    const key = useMemo(() => uuidv4(), []);

    const signOut = () => {
        client?.setAdminSetting("");
        setUser(null);
        setAccessCode(null);
    };

    const signIn = () => {
        poll && (async () => {
            setIsLoading(true);
            setAccessCode((await poll()).token);
        })();
    };

    useDeskproAppEvents({
        onAdminSettingsChange: setSettings,
    }, []);

    // Initialise OAuth flow
    useInitialisedDeskproAppClient((client) => {
        (async () => {
            const { callbackUrl, poll } = await client.oauth2().getAdminGenericCallbackUrl(
                key,
                /code=(?<token>[\d\w-]+)/,
                /state=(?<key>.+)/
            );

            setCallbackUrl(callbackUrl);
            setPoll(() => poll);
        })();
    }, [key]);

    // Exchange auth code for auth/refresh tokens
    useInitialisedDeskproAppClient((client) => {
        const canRequestAccessToken = every([
            accessCode,
            callbackUrl,
            settings?.client_id,
            settings?.client_secret,
            settings?.redirect_uri,
        ]);

        if (!canRequestAccessToken) {
            return;
        }

        const url = new URL(`https://api.hubapi.com/oauth/v1/token`);

        const requestOptions: RequestInit = {
            method: "POST",
            body: new URLSearchParams({
                grant_type: 'authorization_code',
                code: accessCode as string,
                redirect_uri: callbackUrl as string,
                client_id: settings?.client_id as string,
                client_secret: settings?.client_secret as string,
            }),
            headers: {
                "Content-Type": "application/x-www-form-urlencoded",
            },
        };

        (async () => {
            const fetch = await adminGenericProxyFetch(client);
            const response = await fetch(url.toString(), requestOptions);
            const data: {
                token_type: "bearer",
                refresh_token: string,
                access_token: string,
                expires_in: number,
            } = await response.json();

            const tokens: AuthTokens = {
                accessToken: data.access_token,
                refreshToken: data.refresh_token,
            };

            client.setAdminSetting(JSON.stringify(tokens));

            setIsLoading(false);
        })();
    }, [
        accessCode,
        callbackUrl,
        settings?.client_id,
        settings?.client_secret,
        settings?.redirect_uri,
    ]);

    // Get current user
    useInitialisedDeskproAppClient((client) => {
        if (settings?.global_access_token) {
            getAccessTokenInfoService(client, { settings }, true)
                .then(setUser)
                .catch(signOut)
        }
    }, [settings?.global_access_token]);

    // Build auth flow entrypoint URL
    const oAuthUrl = useMemo(() => {
        if (!settings?.redirect_uri) {
            return null;
        }

        return `${settings.redirect_uri}&state=${key}`;
    }, [settings?.redirect_uri, key]);

    // Set blocking flag
    useEffect(() => {
        if (!(callbackUrl && client && poll)) {
            setIsBlocking(true);
        } else if (settings?.global_access_token && !user) {
            setIsBlocking(true);
        } else {
            setIsBlocking(false);
        }
    }, [callbackUrl, client, poll, settings?.global_access_token, user]);

    const cancelLoading = () => setIsLoading(false);

    return {
        callbackUrl,
        user,
        oAuthUrl,
        isLoading,
        isBlocking,
        cancelLoading,
        signIn,
        signOut,
    };
};
