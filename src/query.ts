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
    CONTACT = "contact",
}
