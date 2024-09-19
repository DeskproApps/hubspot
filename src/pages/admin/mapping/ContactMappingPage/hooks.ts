import { useAppContext, useQueryWithClient } from "../../../../hooks";
import { QueryKey } from "../../../../query";
import { getPropertiesService } from "../../../../services/hubspot";
import type { Settings } from "../../../../types";

type UseProperties = () => {
    isLoading: boolean;
    properties: string[];
};

const useProperties: UseProperties = () => {
    const { settings } = useAppContext();

    const properties = useQueryWithClient(
        [QueryKey.PROPERTIES],
        (client) => getPropertiesService(client, "contacts", { settings } as { settings: Settings }),
        { enabled: Boolean(settings), cacheTime: 0 },
    );

    return {
        isLoading: properties.isLoading,
        properties: properties.data ?? []
    };
};

export { useProperties };
