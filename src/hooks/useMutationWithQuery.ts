import { useMutation } from "react-query";
import type { UseMutationResult } from "react-query/types/react/types";
import { useDeskproAppClient } from "@deskpro/app-sdk";

const useMutationWithQuery = (queryKey, queryFn, options): UseMutationResult => {
    const { client } = useDeskproAppClient();

    const key = Array.isArray(queryKey) ? queryKey : [queryKey];

    return useMutation(
        key,
        (data) => (client && queryFn(client, data)),
        {
            ...(options ?? {}),
            enabled: options?.enabled === undefined ? !! client : (client && options?.enabled),
        }
    );
};

export { useMutationWithQuery };
