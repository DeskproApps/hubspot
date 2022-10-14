import every from "lodash/every";
import isEmpty from "lodash/isEmpty";
import {
    IDeskproClient,
    adminGenericProxyFetch,
} from "@deskpro/app-sdk";
import { AuthTokens, PreInstalledRequest } from "./types";
import { BASE_URL } from "./constants";
import { isResponseError } from "./utils";

const preInstalledRequest: PreInstalledRequest = async (
    client: IDeskproClient,
    { url, data = {}, method = "GET", settings },
) => {
    if (!every([settings?.client_id, settings?.client_secret, settings?.global_access_token])) {
        throw new Error("Client id, secret and global access tokens are not defined");
    }

    const baseUrl = `${BASE_URL}${url}`;
    const tokens: AuthTokens = JSON.parse(settings.global_access_token as string);

    const fetch = await adminGenericProxyFetch(client);

    const options: RequestInit = {
        method,
        headers: {
            "Content-Type": "application/json",
            "Accept": "application/json",
            "Authorization": `Bearer ${tokens.accessToken}`,
        }
    };

    if (isEmpty(data)) {
        options.body = JSON.stringify(data);
    }

    const res = await fetch(baseUrl, options);

    if (isResponseError(res)) {
        throw new Error(`${method} ${url}: Response Status [${await res.text()}]`);
    }

    return res.json();
};

export { preInstalledRequest };
