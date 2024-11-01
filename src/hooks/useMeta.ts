import { useMemo } from "react";
import { useAppContext, useQueryWithClient } from "../hooks";
import { getPropertiesMetaService } from "../services/hubspot";
import { QueryKey } from "../query";
import type { Settings } from "../types";
import type { MetaMap } from "../components/common/Builder/StructureBuilder";

type UseMeta = (entity: "contacts"|"deals") => {
    isLoading: boolean;
    metaMap: MetaMap;
};

const useMeta: UseMeta = (entity) => {
    const { settings } = useAppContext();

    const propertiesMeta = useQueryWithClient(
        [QueryKey.PROPERTIES_META, entity],
        (client) => getPropertiesMetaService(client, entity, { settings } as { settings: Settings }),
        { enabled: Boolean(settings), cacheTime: 0 },
    );

    const metaMap = useMemo(() => {
        return (propertiesMeta.data?.results ?? []).reduce<MetaMap>((acc, meta) => {
            if (!acc[meta.name]) {
                acc[meta.name] = meta;
            }
            return acc;
        }, {});
    }, [propertiesMeta.data?.results]);

    return {
        isLoading: propertiesMeta.isLoading,
        metaMap,
    };
};

export { useMeta };
