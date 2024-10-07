import get from "lodash/get";
import isEmpty from "lodash/isEmpty";
import { V2ProxyRequestInit, proxyFetch } from "@deskpro/app-sdk";
import { BASE_URL, placeholders } from "./constants";
// import { refreshTokenService } from "./refreshTokenService";
import { getQueryParams } from "../../utils";
import type { HubSpotError } from "./types";
import type { Request, ApiRequestMethod } from "../../types";

type ErrorData = {
    url: string,
    method: ApiRequestMethod,
    code: number,
    json?: HubSpotError,
    entity?: string,
};

export class DeskproError extends Error {
    code: number;
    status: string;
    category: string;
    entity?: string;

    constructor({ url, method, json, code, entity }: ErrorData) {
        super(get(json, ["message"], `${method} ${url}: Response Status [${JSON.stringify(json)}]`));
        this.code = code;
        this.entity = entity;
        this.status = json?.status || "";
        this.category = json?.category || "";
    }
}

const baseRequest: Request = async (client, {
    url,
    entity,
    data = {},
    method = "GET",
    queryParams = {},
    headers: customHeaders
}) => {
    const dpFetch = await proxyFetch(client);

    const baseUrl = `${BASE_URL}${url}`;
    const params = `${isEmpty(queryParams) ? "" : `?${getQueryParams(queryParams, true)}`}`;
    const requestUrl = `${baseUrl}${params}`;
    const options: V2ProxyRequestInit = {
        method,
        headers: {
            "Authorization": `Bearer ${placeholders.API_TOKEN}`,
            ...customHeaders,
        },
    };

    if (data instanceof FormData) {
        options.body = data;
    } else if (data) {
        options.body = JSON.stringify(data);
        options.headers = {
            ...options.headers,
            "Content-Type": "application/json",
        };
    }

    const res = await dpFetch(requestUrl, options);

    /** ToDo: Uncomment when we'll back to the OAuth2
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
    }*/

    if (res.status < 200 || res.status > 399) {
        throw new DeskproError({
            url,
            method,
            entity,
            code: res.status,
            json: (res.status === 404) ? null : await res.json(),
        });
    }

    return await res.json();
};

export { baseRequest };
