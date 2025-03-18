export const ACCESS_TOKEN_PATH = "oauth/global/access_token";
export const REFRESH_TOKEN_PATH = "oauth/global/refresh_token";

export const placeholders = {
    CLIENT_ID: "__client_id__",
    CLIENT_SECRET: "__client_secret__",
    REDIRECT_URI: "__redirect_uri__",
    TOKEN: `__global_access_token.json("[accessToken]")__`,
    REFRESH_TOKEN: `__global_access_token.json("[refreshToken]")__`,
    TOKEN_IN_STATE: `[[${ACCESS_TOKEN_PATH}]]`,
    REFRESH_TOKEN_IN_STATE: `[[${REFRESH_TOKEN_PATH}]]`,
    API_TOKEN: "__api_token__",
    OAUTH2_ACCESS_TOKEN_PATH: "oauth2/access_token",
    OAUTH2_REFRESH_TOKEN_PATH: "oauth2/refresh_token"
};

export const BASE_URL = "https://api.hubapi.com";

export const PROPERTIES = {
    deals: [
        "hs_object_id",
        "hubspot_owner_id",
        "amount",
        "dealname",
        "pipeline",
        "dealstage",
        "closedate",
        "dealtype",
        "hs_priority",
        "deal_currency_code",
    ],
    notes: [
        "hs_object_id",
        "hubspot_owner_id",
        "hs_note_body",
        "hs_lastmodifieddate",
    ],
    calls: [
        "hs_object_id",
        "hs_call_body",
        "hs_call_title",
        "hs_timestamp",
        "hs_call_duration",
        "hubspot_owner_id",
    ],
    emails: [
        "hs_object_id",
        "hs_email_html",
        "hs_timestamp",
        "hs_email_text",
        "hs_email_subject",
        "hs_email_from_firstname",
        "hs_email_from_lastname",
        "hs_email_to_firstname",
        "hs_email_to_lastname",
        "hubspot_owner_id",
        "hs_body_preview",
    ],
    contacts: [
        "hubspot_owner_id",
        "email",
        "phone",
        "jobtitle",
        "lastname",
        "firstname",
        "lifecyclestage",
    ],
    companies: ["name"],
};
