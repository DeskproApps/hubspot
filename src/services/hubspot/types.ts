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
    | "contact"
    | "contacts"
    | "company"
    | "companies"
    | "deal"
    | "deals"
    | "notes"
    | "emails"
    | "calls";

export type HubSpotError = {
    status: "error",
    category: "VALIDATION_ERROR"|"CONFLICT"|"MISSING_SCOPES",
    correlationId: string,
    message: string,
    errors?: Array<{ message: string }>,
};

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

export type Companies = {
    results: Company[],
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
        deal_currency_code: string,
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
        hs_email_html?: string,
        hs_timestamp: DateTime,
        hs_email_text?: string,
        hs_email_subject?: string,
        hs_email_from_firstname?: string,
        hs_email_from_lastname?: string,
        hs_email_to_firstname?: string,
        hs_email_to_lastname?: string,
        hs_body_preview?: string,
        hubspot_owner_id: string,
    },
};

export type CallActivity = {
    id: string,
    archived: boolean,
    createdAt: DateTime,
    updatedAt: DateTime,
    properties: {
        hs_object_id: CallActivity["id"],
        hs_call_body?: string,
        hs_call_title?: string,
        hs_timestamp: DateTime,
        hs_call_duration?: number,
        hubspot_owner_id: string,
    },
};

export type CallDispositions = {
    deleted: boolean,
    id: string,
    label: string,
};

export type CallDirectionOption = {
    label: string,
    value: string,
    hidden: boolean,
    displayOrder: number,
};

export type CallDirections = {
    updatedAt: DateTime,
    createdAt: DateTime,
    name: "hs_call_direction",
    label: string,
    type: "enumeration",
    fieldType: "select",
    description: string,
    groupName: "call",
    options: CallDirectionOption[],
    displayOrder: number,
    calculated: boolean,
    externalOptions: boolean,
    hasUniqueValue: boolean,
    hidden: boolean,
    hubspotDefined: boolean,
    modificationMetadata: {
        archivable: boolean,
        readOnlyDefinition: boolean,
        readOnlyValue: boolean,
    },
    formField: false,
};

export type PipelineTypes =
    | "deals"
    | "contacts";

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

export type DealTypeOption = {
    label: string,
    value: string,
    displayOrder: number,
    hidden: boolean,
};

export type DealTypes = {
    updatedAt: DateTime,
    createdAt: DateTime,
    name: "dealtype",
    label: string,
    type: "enumeration",
    fieldType: "radio",
    description: string,
    groupName: string,
    options: DealTypeOption[],
    displayOrder: number,
    calculated: boolean,
    externalOptions: boolean,
    hasUniqueValue: boolean,
    hidden: boolean,
    hubspotDefined: boolean,
    modificationMetadata: {
        archivable: boolean,
        readOnlyDefinition: boolean,
        readOnlyOptions: boolean,
        readOnlyValue: boolean,
    },
    formField: boolean,
};

export type LeadStatusOption = {
    label: string,
    value: string,
    description: string,
    displayOrder: number,
    hidden: boolean,
};

export type LeadStatus = {
    "label": string,
    "name": "hs_lead_status",
    "description": string,
    "options": LeadStatusOption[],
    "updatedAt": DateTime,
    "createdAt": DateTime,
    "type": string,
    "fieldType": string,
    "groupName": string,
    "displayOrder": number,
    "calculated": boolean,
    "externalOptions": boolean,
    "hasUniqueValue": boolean,
    "hidden": boolean,
    "hubspotDefined": boolean,
    "modificationMetadata": {
        "archivable": true,
        "readOnlyDefinition": true,
        "readOnlyOptions": false,
        "readOnlyValue": false
    },
    "formField": boolean,
};

export type DealPriorityOption = {
    label: string,
    value: string,
    displayOrder: number,
    hidden: boolean,
};

export type DealPriority = {
    updatedAt: DateTime,
    createdAt: DateTime,
    label: string,
    name: "hs_priority",
    type: "enumeration",
    fieldType: "select",
    groupName: string,
    description: string,
    options: DealPriorityOption[],
    displayOrder: number,
    calculated: boolean,
    externalOptions: boolean,
    hasUniqueValue: boolean,
    hidden: boolean,
    hubspotDefined: boolean,
    modificationMetadata: {
        archivable: boolean,
        readOnlyDefinition: boolean,
        readOnlyValue: boolean,
    },
    formField: boolean,
};

export type AssociationTypes =
    | "deal_to_contact"
    | "deal_to_company"
    | "note_to_contact"
    | "call_to_contact"
    | "call_to_company"
    | "call_to_deal"
    | "email_to_contact"
    | "email_to_company"
    | "email_to_deal"
;

export type UploadFile = {
    id: string,
    createdAt: DateTime,
    updatedAt: DateTime,
    archived: boolean,
    name: string,
    path: string,
    size: number,
    height?: number,
    width?: number,
    encoding: string,
    type: "IMG" | "DOCUMENT" | "AUDIO" | "MOVIE" | "OTHER",
    extension: string,
    defaultHostingUrl: string,
    url: string,
    isUsableInContent: boolean,
    access: "PUBLIC_INDEXABLE" | "PUBLIC_NOT_INDEXABLE" | "PRIVATE",
};

export type EntityMetadata = {
    id: Contact["id"],
    fullName: string,
    phone: Contact["properties"]["phone"],
    email: Contact["properties"]["email"],
    companies: Array<{
        id: Company["id"],
        name: Company["properties"]["name"],
    }>,
    deals: Array<{
        id: Deal["id"],
        name: Deal["properties"]["dealname"],
    }>,
};
