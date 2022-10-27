import { useQuery } from "react-query";
import {
    UseQueryResult,
    UseQueryOptions,
} from "react-query/types/react/types";
import {
    IDeskproClient,
    useDeskproAppClient,
} from "@deskpro/app-sdk";

/**
 * Decorate react useQuery hook such that we can inject the Deskpro apps client into query functions and make sure that
 * the query is disabled (and has a different key) if the Deskpro client is uninitialized
 */
const useQueryWithClient = <TQueryFnData = unknown, TError = unknown, TData = TQueryFnData>(
    queryKey: string | readonly unknown[],
    queryFn: (client: IDeskproClient) => Promise<TQueryFnData>,
    options?: Omit<UseQueryOptions<TQueryFnData, unknown, TData, string | readonly unknown[]>, 'queryKey' | 'queryFn'>
): UseQueryResult<TData> => {
    const { client } = useDeskproAppClient();

    const key = Array.isArray(queryKey) ? queryKey : [queryKey];

    return useQuery<TQueryFnData, TError, TData>(
        key,
        () => (client && queryFn(client)) as Promise<TQueryFnData>,
        {
            ...(options ?? {}),
            enabled: options?.enabled === undefined ? !! client : (client && options?.enabled),
        } as Omit<UseQueryOptions<TQueryFnData, TError, TData, string | readonly unknown[]>, 'queryKey' | 'queryFn'>
    );
}

export { useQueryWithClient };
