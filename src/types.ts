import { ReactElement } from "react";
import { IDeskproClient, Context } from "@deskpro/app-sdk";

/**
 * An ISO-8601 encoded UTC date time string. Example value: `""2019-09-07T15:50:00Z"`.
 */
export type DateTime = string;

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

export type ApiRequestMethod = "GET" | "POST" | "PATCH";

export type RequestParams = {
    url: string,
    method?: ApiRequestMethod,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    data?: any,
    headers?: Record<string, string>,
    queryParams?: Record<string, string|number|boolean>,
    entity?: string,
};

export type Request = <T>(
    client: IDeskproClient,
    params: RequestParams,
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

export type DeskproUser = {
    emails: string[],
    firstName: string,
    id: string,
    isAgent: boolean,
    isConfirmed: boolean,
    isDisabled: boolean,
    lastName: string,
    name: string,
    primaryEmail: string,
    titlePrefix: string,
};

export type ContextData = {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    app: any,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    currentAgent: any,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    env: any,
    user: DeskproUser,
};

export type UserContext = Context<ContextData>;

export type EventsPayload =
    | { type: "changePage", path: string }
    | { type: "unlink", userId: string, contactId: string };

export type Option<Value> = {
    value: Value,
    key: Value,
    label: string | ReactElement,
    type: "value",
};
