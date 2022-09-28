import { IDeskproClient, proxyFetch } from "@deskpro/app-sdk";
import {
    placeholders,
    ACCESS_TOKEN_PATH,
    REFRESH_TOKEN_PATH,
} from "./constants";

const refreshTokenService = async (client: IDeskproClient) => {
    const fetch = await proxyFetch(client);

    const refreshRequestOptions: RequestInit = {
        method: "POST",
        body: `grant_type=refresh_token&client_id=${placeholders.CLIENT_ID}&client_secret=${placeholders.CLIENT_SECRET}&redirect_uri=${placeholders.REDIRECT_URI}&refresh_token=${placeholders.REFRESH_TOKEN}`,
        headers: {
            "Content-Type": "application/x-www-form-urlencoded",
        },
    };

    const refreshRes = await fetch("https://api.hubapi.com/oauth/v1/token", refreshRequestOptions);
    const refreshData = await refreshRes.json();

    return Promise.all([
        client.setState<string>(ACCESS_TOKEN_PATH, refreshData.access_token, { backend: true }),
        client.setState<string>(REFRESH_TOKEN_PATH, refreshData.refresh_token, { backend: true }),
    ])
        .then(() => true)
        .catch(() => false);
};

export { refreshTokenService };
