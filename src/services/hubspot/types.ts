import type { DateTime } from "../../types";

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

export type EntityType = "contacts" | "companies" | "deals";

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

export type Company = {
    id: string,
    properties: {
        createdate: DateTime,
        domain?: string,
        hs_lastmodifieddate: DateTime,
        hs_object_id: Company["id"],
        name: string,
    },
};

export type Owner = {
    archived: boolean,
    createdAt: DateTime,
    email: string,
    firstName: string,
    id: string,
    lastName: string,
    updatedAt: DateTime,
    userId: number,
};

export type Deal = {
    id: string,
    archived: boolean,
    createdAt: DateTime,
    updatedAt: DateTime,
    properties: {
        hs_object_id: Deal["id"],
        dealname: string,
        amount: string,
        dealstage: string,
        closedate: DateTime,
        createdate: DateTime,
        hs_lastmodifieddate: DateTime,
        pipeline: string,
    },
};
