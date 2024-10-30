import { useMemo } from "react";
import { getDealService, getPropertiesMetaService } from "../services/hubspot";
import { useQueryWithClient } from "../hooks";
import { QueryKey } from "../query";
import type {
    Deal,
    PropertyMeta,
} from "../services/hubspot/types";
import type { MetaMap } from "../components/common/Builder";

type UseLoadUpdateDealDeps = (dealId?: Deal["id"]) => {
    isLoading: boolean,
    deal: Deal["properties"],
    dealMeta: MetaMap,
};

const useLoadUpdateDealDeps: UseLoadUpdateDealDeps = (dealId) => {
    const deal = useQueryWithClient(
        [QueryKey.DEALS, dealId],
        (client) => getDealService(client, dealId as Deal["id"]),
        { enabled: !!dealId },
    );

    const dealMeta = useQueryWithClient(
        [QueryKey.PROPERTIES_META, "deals"],
        (client) => getPropertiesMetaService(client, "deals"),
    );

    return {
        isLoading: (Boolean(dealId) && deal.isLoading) || dealMeta.isLoading,
        deal: (deal.data?.properties ?? []) as Deal["properties"],
        dealMeta: useMemo(() => {
            return (dealMeta.data?.results ?? []).reduce<Record<PropertyMeta["fieldType"], PropertyMeta>>((acc, meta) => {
                if (!acc[meta.name]) {
                    acc[meta.name] = meta;
                }
                return acc;
            }, {});
        }, [dealMeta.data?.results]),
    };
};

export { useLoadUpdateDealDeps };
