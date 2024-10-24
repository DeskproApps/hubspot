import { useMemo } from "react";
import { useDeskproLatestAppContext } from "@deskpro/app-sdk";
import { useQueryWithClient } from "../../hooks";
import { getPropertiesMetaService } from "../../services/hubspot";
import { QueryKey } from "../../query";
import { getScreenStructure } from "../../utils";
import type { ContextData, Settings } from "../../types";
import type { Layout, FormBuilderProps } from "../../components/common/Builder";
import type { PropertyMeta } from "../../services/hubspot/types";


type UseContactMeta = () => {
    isLoading: boolean;
    structure: Layout;
    contactMetaMap: FormBuilderProps["config"]["metaMap"];
};

const useContactMeta: UseContactMeta = () => {
    const { context } = useDeskproLatestAppContext<ContextData, Settings>();
    const structure = getScreenStructure(context?.settings, "contact", "view");

    const propertiesMeta = useQueryWithClient(
        [QueryKey.PROPERTIES_META, "contact"],
        (client) => getPropertiesMetaService(client, "contacts"),
    );

    const contactMetaMap = useMemo(() => {
        return (propertiesMeta.data?.results ?? [])
            .reduce<Record<PropertyMeta["name"], PropertyMeta>>((acc, meta) => {
                if (!acc[meta.name]) {
                    acc[meta.name] = meta;
                }
                return acc;
            }, {});
    }, [propertiesMeta.data?.results]);

    return {
        isLoading: !context || propertiesMeta.isLoading,
        structure,
        contactMetaMap,
    };
};

export { useContactMeta };
