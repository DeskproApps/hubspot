import { IDeskproClient, OAuth2Result, proxyFetch } from "@deskpro/app-sdk";

interface GetAccessTokenParams {
    code: string;
    callbackURL: string;
}

export async function getAccessToken(
    client: IDeskproClient,
    params: GetAccessTokenParams
): Promise<OAuth2Result["data"]> {
    try {
        const { code, callbackURL } = params;
        const fetch = await proxyFetch(client);

        const response = await fetch(`https://api.hubapi.com/oauth/v1/token`, {
            method: "POST",
            headers: {
                "Content-Type": "application/x-www-form-urlencoded"
            },
            body: new URLSearchParams({
                grant_type: "authorization_code",
                client_id: "__client_id__",
                client_secret: "__client_secret__",
                code: code,
                redirect_uri: callbackURL
            }).toString()
        });

        if (!response.ok) {
            throw new Error("Failed to fetch access token");
        }

        const data = await response.json() as OAuth2Result["data"]
        return data;
    } catch (error) {
        throw new Error("Error fetching access token");
    }
}
