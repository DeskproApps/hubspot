import isEmpty from "lodash/isEmpty";
import { proxyFetch } from "@deskpro/app-sdk";
import { Request } from "./types";
import { BASE_URL, placeholders } from "./constants";
import { getQueryParams } from "../../utils";

const baseRequest: Request = async (client, {
    url,
    rawUrl,
    data = {},
    method = "GET",
    queryParams = {},
    headers: customHeaders
}) => {
    const dpFetch = await proxyFetch(client);

    let body = undefined;
    const headers: Record<string, string> = {};

    const baseUrl = `${rawUrl ? rawUrl : `${BASE_URL}${url}`}`;
    const params = `${isEmpty(queryParams) ? "" : `?${getQueryParams(queryParams, true)}`}`;
    const requestUrl = `${baseUrl}${params}`;

    if (data instanceof FormData) {
        body = data;
    } else if(data) {
        body = JSON.stringify(data);
    }

    if (body instanceof FormData) {
        //...
    } else if (data) {
        headers["Content-Type"] = "application/json";
        headers["authorization"] = `Bearer ${placeholders.TOKEN}`;
    }

    const res = await dpFetch(requestUrl, {
        method,
        body,
        headers: {
            ...headers,
            ...customHeaders,
        },
    });

    if ([400, 401].includes(res.status)) {
        return await res.json();
    }

    if (res.status < 200 || res.status >= 400) {
        throw new Error(`${method} ${url}: Response Status [${await res.text()}]`);
    }

    return await res.json();
};

export { baseRequest };
