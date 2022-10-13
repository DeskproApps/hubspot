import { QueryClient } from "react-query";

export const query = new QueryClient({
    defaultOptions: {
        queries: {
            suspense: true,
            refetchOnWindowFocus: false,
        },
    },
});

export enum QueryKey {
    CURRENT_ACCOUNT = "currentUserAccount",
    CHECK_AUTH = "checkAuth",
    ENTITY = "entity",
    CONTACT = "contact",
    COMPANY = "company",
    OWNERS = "owners",
    DEALS = "deals",
    NOTES = "notes",
    EMAIL_ACTIVITIES = "emailActivities",
    CALL_ACTIVITIES = "callActivities",
    ACCOUNT_INFO = "accountInfo",
}
