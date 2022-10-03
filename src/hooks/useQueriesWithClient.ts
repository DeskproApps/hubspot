import { useQueries } from "react-query";
import { IDeskproClient, useDeskproAppClient } from "@deskpro/app-sdk";

const useQueriesWithClient = (queries) => {
    const { client } = useDeskproAppClient();

    return useQueries(queries?.map(({ queryFn, ...options }) => ({
        queryFn: () => (client && queryFn(client)),
        ...(options ?? {}),
        enabled: options?.enabled === undefined ? !! client : (client && options?.enabled),
    })) ?? []);
};

export { useQueriesWithClient };
