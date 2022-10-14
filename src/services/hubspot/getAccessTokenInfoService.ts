import { IDeskproClient } from "@deskpro/app-sdk";
import { Settings, AuthTokens } from "../../types";
import { AccessTokenInfo } from "./types";
import { placeholders } from "./constants";
import { baseRequest } from "./baseRequest";
import { preInstalledRequest } from "./preInstalledRequest";

const getAccessTokenInfoService = (
    client: IDeskproClient,
    params?: { settings: Settings },
    preInstalled = false,
) => {
    if (preInstalled && params?.settings?.global_access_token) {
        const tokens: AuthTokens = JSON.parse(params?.settings.global_access_token);
        return preInstalledRequest<AccessTokenInfo>(client, {
            url: `/oauth/v1/access-tokens/${tokens.accessToken}`,
            ...params,
        });
    } else {
        return baseRequest<AccessTokenInfo>(client, { url: `/oauth/v1/access-tokens/${placeholders.TOKEN}` });
    }
};

export { getAccessTokenInfoService };
