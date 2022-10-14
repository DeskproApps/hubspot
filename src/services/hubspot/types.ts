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

export type EntityType =
    | "contacts"
    | "companies"
    | "deals"
    | "notes"
    | "emails"
    | "calls";

export type Contact = {
    id: string,
    properties: {
        hs_object_id: Contact["id"],
        email: string,
        phone: string,
        firstname: string,
        lastname: string,
        createdate: DateTime,
        lastmodifieddate: DateTime,
        jobtitle: string,
        lifecyclestage: string,
        hubspot_owner_id: string|null,
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
        dealtype: string,
        closedate: DateTime,
        createdate: DateTime,
        hs_lastmodifieddate: DateTime,
        pipeline: string,
        hubspot_owner_id: Owner["id"],
        hs_priority: string,
    },
};

export type Note = {
    id: string,
    archived: boolean,
    createdAt: DateTime,
    updatedAt: DateTime,
    properties: {
        hs_note_body: string,
        hs_object_id: Note["id"],
        hubspot_owner_id: Owner["id"],
        hs_lastmodifieddate: DateTime,
    },
};

export type EmailActivity = {
    id: string,
    archived: boolean,
    createdAt: DateTime,
    updatedAt: DateTime,
    properties: {
        hs_object_id: EmailActivity["id"],
        hs_email_html: string,
        hs_timestamp: DateTime,
        hs_email_subject?: string,
    },
};

export type CallActivity = {
    id: string,
    archived: boolean,
    createdAt: DateTime,
    updatedAt: DateTime,
    properties: {
        hs_object_id: CallActivity["id"],
        hs_call_body: string,
        hs_call_title?: string,
        hs_timestamp: DateTime,
    },
};

export type PipelineTypes =
    | "deals";

export type PipelineStage = {
    id: string,
    label: string,
    createdAt: DateTime,
    updatedAt: DateTime,
    archived: boolean,
    displayOrder: number,
    writePermissions: string,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    metadata: any,
};

export type Pipeline = {
    id: string,
    label: string,
    createdAt: DateTime,
    updatedAt: DateTime,
    displayOrder: number,
    archived: boolean,
    stages: Array<PipelineStage>,
};

export type AccountInto = {
    accountType: string,
    additionalCurrencies: string[],
    companyCurrency: string,
    dataHostingLocation: string,
    portalId: number,
    timeZone: string,
    uiDomain: string,
    utcOffset: string,
    utcOffsetMilliseconds: number,
}

export type DealTypes = {
    "updatedAt": DateTime,
    "createdAt": DateTime,
    "name": "dealtype",
    "label": string,
    "type": "enumeration",
    "fieldType": "radio",
    "description": string,
    "groupName": string,
    "options": Array<{
        "label": string,
        "value": string,
        "displayOrder": number,
        "hidden": boolean,
    }>,
    "displayOrder": number,
    "calculated": boolean,
    "externalOptions": boolean,
    "hasUniqueValue": boolean,
    "hidden": boolean,
    "hubspotDefined": boolean,
    "modificationMetadata": {
        "archivable": boolean,
        "readOnlyDefinition": boolean,
        "readOnlyOptions": boolean,
        "readOnlyValue": boolean,
    },
    "formField": boolean,
};
