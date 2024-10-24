import { useAppContext } from "./AppContext";
import { useQueryWithClient } from "./useQueryWithClient";
import { QueryKey } from "../query";
import { getPropertiesService } from "../services/hubspot";
import type { Settings } from "../types";

type UseProperties = (entity: "contacts"|"deals") => {
    isLoading: boolean;
    properties: string[];
};

const useProperties: UseProperties = (entity) => {
    const { settings } = useAppContext();

    const properties = useQueryWithClient(
        [QueryKey.PROPERTIES],
        (client) => getPropertiesService(client, entity, { settings } as { settings: Settings }),
        { enabled: Boolean(settings), cacheTime: 0 },
    );

    return {
        isLoading: properties.isLoading,
        properties: properties.data ?? []
    };
};

export { useProperties };
