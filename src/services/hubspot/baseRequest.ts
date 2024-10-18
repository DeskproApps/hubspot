import get from "lodash/get";
import isEmpty from "lodash/isEmpty";
import { proxyFetch, adminGenericProxyFetch } from "@deskpro/app-sdk";
import { BASE_URL, placeholders } from "./constants";
import { getQueryParams } from "../../utils";
import type { IDeskproClient } from "@deskpro/app-sdk";
import type { HubSpotError } from "./types";
import type { Request, ApiRequestMethod, RequestParams } from "../../types";

type ErrorData = {
    url: string,
    method: ApiRequestMethod,
    code: number,
    json?: HubSpotError|null,
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


const baseRequest: Request = async <T = unknown>(
    client: IDeskproClient,
    {
        url,
        entity,
        data = {},
        method = "GET",
        queryParams = {},
        headers: customHeaders,
        settings,
    }: RequestParams,
): Promise<T> => {
    const isAdmin = Boolean(settings);
    const dpFetch = await (isAdmin ? adminGenericProxyFetch : proxyFetch)(client);
    const baseUrl = `${BASE_URL}${url}`;
    const params = `${isEmpty(queryParams) ? "" : `?${getQueryParams(queryParams, true)}`}`;
    const requestUrl = `${baseUrl}${params}`;
    const options: RequestInit = {
        method,
        headers: {
            "Authorization": `Bearer ${settings?.api_token ?? placeholders.API_TOKEN}`,
            ...customHeaders,
        },
    };

    if (data instanceof FormData) {
        options.body = data;
    } else if (data) {
        options.body = JSON.stringify(data);
        options.headers = {
            "Content-Type": "application/json",
            ...options.headers,
        };
    }

    const res = await dpFetch(requestUrl, options);

    if (res.status < 200 || res.status > 399) {
        throw new DeskproError({
            url,
            method,
            entity,
            code: res.status,
            json: (res.status === 404) ? null : await res.json() as HubSpotError,
        });
    }

    let result = {} as T;

    try {
        result = await res.json() as T;
    } catch (e) {
        // eslint-disable-next-line no-console
        console.warn("Failed to parse response as JSON. Returning empty result");
    }
  
    return result;
};

export { baseRequest };
