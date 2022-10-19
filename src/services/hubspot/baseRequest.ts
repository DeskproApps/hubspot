import isEmpty from "lodash/isEmpty";
import { proxyFetch } from "@deskpro/app-sdk";
import { Request, ApiRequestMethod } from "../../types";
import { BASE_URL, placeholders } from "./constants";
// import { refreshTokenService } from "./refreshTokenService";
import { getQueryParams } from "../../utils";

type ErrorData = {
    url: string,
    code: number,
    text: string,
    entity: string|undefined,
    method: ApiRequestMethod,
};

export class DeskproError extends Error {
    code: number;
    entity?: string;

    constructor({ url, method, text, code, entity }: ErrorData) {
        super(`${method} ${url}: Response Status [${text}]`);
        this.code = code;
        this.entity = entity;
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
    const options: RequestInit = {
        method,
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${placeholders.API_TOKEN}`,
            ...customHeaders,
        },
    };

    if (data) {
        options.body = JSON.stringify(data);
    }

    const res = await dpFetch(requestUrl, options);

    /** ToDo: handle missing scopes
    category:"MISSING_SCOPES"
    correlationId:"77eb4d5a-c125-4eb3-b30d-3442855d35d7"
    errors
        0:{
            message: "One or more of the following scopes are required.",
            context: {requiredScopes: ["contacts"]}
        }
    context
        :{ requiredScopes: ["contacts"] }
    message:"One or more of the following scopes are required."
    links:{ scopes: "https://developers.hubspot.com/scopes" }
    message:"This app hasn't been granted all required scopes to make this call. Read more about required scopes here: https://developers.hubspot.com/scopes."
    status:"error"
     */

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

    if (res.status === 400) {
        return await res.json();
    }

    if (res.status < 200 || res.status >= 400) {
        throw new DeskproError({
            url,
            method,
            entity,
            code: res.status,
            text: await res.text(),
        });
    }

    return await res.json();
};

export { baseRequest };
