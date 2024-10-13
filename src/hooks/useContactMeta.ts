import { useMemo } from "react";
import { useQueryWithClient } from "../hooks";
import { getPropertiesMetaService } from "../services/hubspot";
import { QueryKey } from "../query";
import type { Contact, PropertyMeta } from "../services/hubspot/types";

type useContactMeta = (contactId?: Contact["id"]) => {
    isLoading: boolean;
    contactMetaMap: Record<PropertyMeta["name"], PropertyMeta>;
};

const useContactMeta = () => {
    const propertiesMeta = useQueryWithClient(
        [QueryKey.PROPERTIES_META, "contact"],
        (client) => getPropertiesMetaService(client, "contacts"),
    );

    const contactMetaMap = useMemo(() => {
        return (propertiesMeta.data?.results ?? []).reduce<Record<PropertyMeta["name"], PropertyMeta>>((acc, meta) => {
            if (!acc[meta.name]) {
                acc[meta.name] = meta;
            }
            return acc;
        }, {});
    }, [propertiesMeta.data?.results]);

    return {
        isLoading: contactMetaMap.isLoading,
        contactMetaMap,
    };
};

export { useContactMeta };
