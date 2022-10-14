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

export type Contact = {
    id: string,
    properties: {
        hs_object_id: Contact["id"],
        email: string,
        firstname: string,
        lastname: string,
        createdate: DateTime,
        lastmodifieddate: DateTime,
    },
    archived: boolean,
    createdAt: DateTime,
    updatedAt: DateTime,
};

export type Contacts = {
    results: Contact[],
    total: number,
};
