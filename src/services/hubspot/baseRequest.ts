import isEmpty from "lodash/isEmpty";
import { proxyFetch } from "@deskpro/app-sdk";
import { Request } from "../../types";
import { BASE_URL, placeholders } from "./constants";
import { refreshTokenService } from "./refreshTokenService";
import { getQueryParams } from "../../utils";

const baseRequest: Request = async (client, {
    url,
    data = {},
    method = "GET",
    queryParams = {},
    headers: customHeaders
}) => {
    const dpFetch = await proxyFetch(client);

    const baseUrl = `${BASE_URL}${url}`;
    const params = `${isEmpty(queryParams) ? "" : `?${getQueryParams(queryParams, true)}`}`;
    const requestUrl = `${baseUrl}${params}`;
    const options: RequestInit = {
        method,
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${placeholders.TOKEN}`,
            ...customHeaders,
        },
    };

    if (data) {
        options.body = JSON.stringify(data);
    }

    let res = await dpFetch(requestUrl, options);

    if ([401].includes(res.status)) {
        options.headers = {
            ...options.headers,
            "Authorization": `Bearer ${placeholders.TOKEN_IN_STATE}`,
        };
        res = await dpFetch(requestUrl, options);

        if ([401].includes(res.status)) {
            const isRefresh = await refreshTokenService(client);

            if (isRefresh) {
                options.headers = {
                    ...options.headers,
                    "Authorization": `Bearer ${placeholders.TOKEN_IN_STATE}`,
                };
                res = await dpFetch(requestUrl, options);
            }
        }
    }

    if (res.status < 200 || res.status >= 400) {
        throw new Error(`${method} ${url}: Response Status [${await res.text()}]`);
    }

    return await res.json();
};

export { baseRequest };
