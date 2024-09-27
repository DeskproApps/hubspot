import { QueryClient } from "@tanstack/react-query";

export const queryClient = new QueryClient({
    defaultOptions: {
        queries: {
          suspense: false,
          useErrorBoundary: true,
          refetchOnWindowFocus: false,
          retry: 1,
          retryDelay: 1500,
        },
    },
});

export enum QueryKey {
    CURRENT_ACCOUNT = "currentUserAccount",
    CHECK_AUTH = "checkAuth",
    ENTITY = "entity",
    CONTACT = "contact",
    CONTACTS = "contacts",
    LINKED_CONTACTS = "linkedContacts",
    COMPANY = "company",
    COMPANIES = "companies",
    OWNERS = "owners",
    DEALS = "deals",
    NOTES = "notes",
    EMAIL_ACTIVITIES = "emailActivities",
    CALL_ACTIVITIES = "callActivities",
    PIPELINES = "pipelines",
    ACCOUNT_INFO = "accountInfo",
    PROPERTIES = "properties",
    PROPERTIES_META = "propertiesMeta",
    DEALS_BY_CONTACT_ID = "dealsByContactId",
    NOTES_BY_CONTACT_ID = "notesByContactId",
    CALLS_BY_CONTACT_ID = "callsByContactId",
    EMAILS_BY_CONTACT_ID = "emailsByContactId",
    COMPANIES_BY_CONTACT_ID = "companiesByContactId",
}
