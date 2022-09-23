import { IDeskproClient } from "@deskpro/app-sdk";

export type Settings = {
    client_id?: string,
    client_secret?: string,
    redirect_uri?: string,
    global_access_token?: string,
};

export type AuthTokens = {
    accessToken: string,
    refreshToken: string,
};

export type ApiRequestMethod = "GET" | "POST";

export type RequestParams = {
    url: string,
    method?: ApiRequestMethod,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    data?: any,
    headers?: Record<string, string>,
    queryParams?: Record<string, string|number|boolean>,
};

export type Request = <T>(
    client: IDeskproClient,
    params: RequestParams
) => Promise<T>;

export type PreRequestParams = {
    url: string,
    settings: Settings,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    data?: Record<string, any>,
    method?: ApiRequestMethod,
};

export type PreInstalledRequest = <T>(
    client: IDeskproClient,
    params: PreRequestParams,
) => Promise<T>;

/**
 * An ISO-8601 encoded UTC date time string. Example value: `""2019-09-07T15:50:00Z"`.
 */
export type DateTime = string;

export type AccessTokenResponse = {
    token_type: "bearer",
    refresh_token: string,
    access_token: string,
    expires_in: number,
};

export type AccessTokenInfo = {
    user: string,
    user_id: number,
    token: string,
    app_id: number,
    hub_domain: string,
    scopes: string[],
    scope_to_scope_group_pks: number[],
    trial_scopes: string[],
    trial_scope_to_scope_group_pks: number[],
    hub_id: number,
    expires_in: number,
    token_type: string,
}
