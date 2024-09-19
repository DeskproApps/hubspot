import get from "lodash/get";
import isEmpty from "lodash/isEmpty";
import { proxyFetch, adminGenericProxyFetch } from "@deskpro/app-sdk";
import { BASE_URL, placeholders } from "./constants";
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
    headers: customHeaders,
    settings,
}) => {
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
            json: (res.status === 404) ? null : await res.json(),
        });
    }

    let result;

    try {
      result = await res.json();
    } catch (e) {
      return {};
    }
  
    return result;
};

export { baseRequest };
