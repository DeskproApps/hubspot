import { useQueries } from "react-query";
import { IDeskproClient, useDeskproAppClient } from "@deskpro/app-sdk";
import { UseQueryOptions, UseQueryResult } from "react-query/types/react/types";

const useQueriesWithClient = <TQueryFnData = null>(
    queries: Array<{
        queryFn: (client: IDeskproClient) => Promise<TQueryFnData>,
    } & Omit<UseQueryOptions<TQueryFnData, unknown, TQueryFnData, string | readonly unknown[]>, "queryFn">>,
): Array<UseQueryResult<TQueryFnData>> => {
    const { client } = useDeskproAppClient();

    return useQueries(queries?.map(({ queryFn, ...options }) => ({
        queryFn: () => (client && queryFn(client)),
        ...(options ?? {}),
        enabled: options?.enabled === undefined ? !! client : (client && options?.enabled),
    }) as UseQueryOptions<TQueryFnData, unknown, TQueryFnData, string | readonly unknown[]>) ?? []);
};

export { useQueriesWithClient };
