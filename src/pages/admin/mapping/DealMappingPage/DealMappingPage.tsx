import { useMemo, useCallback } from "react";
import { useDeskproAppClient, LoadingSpinner } from "@deskpro/app-sdk";
import { useMeta, useAppContext, useProperties } from "../../../../hooks";
import { STRUCTURE } from "../../../../constants";
import { DealMapping } from "../../../../components";
import type { FC } from "react";
import type { DealLayout } from "../../../../types";

const DealMappingPage: FC = () => {
    const { client } = useDeskproAppClient();
    const { settings, isLoading: isLoadingContext } = useAppContext();
    const { properties, isLoading: isLoadingProperties } = useProperties("deals");
    const { metaMap, isLoading: isLoadingMeta } = useMeta("deals");
    const isLoading = isLoadingContext || isLoadingProperties || isLoadingMeta;

    const structure: DealLayout = useMemo(() => {
        return settings?.mapping_deal
          ? JSON.parse(settings.mapping_deal) as DealLayout
          : STRUCTURE.DEAL
      }, [settings?.mapping_deal]);

    const onChangeStructure = useCallback((structure: DealLayout) => {
        client?.setAdminSetting(JSON.stringify(structure));
      }, [client]);

    if (!client || !settings || isLoading) {
        return (
            <LoadingSpinner/>
        );
    }

    return (
        <DealMapping
            meta={metaMap}
            structure={structure}
            properties={properties}
            onChangeStructure={onChangeStructure}
        />
    );
};

export { DealMappingPage };
