import { useMemo, useCallback } from "react";
import {
  LoadingSpinner,
  useDeskproAppClient,
} from "@deskpro/app-sdk";
import { useAppContext, useContactMeta } from "../../../../hooks";
import { useProperties } from "./hooks";
import { STRUCTURE } from "../../../../constants";
import { ContactMapping } from "../../../../components";
import type { FC } from "react";
import type { ContactLayout } from "../../../../types";

const ContactMappingPage: FC = () => {
    const { client } = useDeskproAppClient();
    const { settings, isLoading: isLoadingContext } = useAppContext();
    const { properties, isLoading: isLoadingProperties } = useProperties();
    const { contactMetaMap, isLoading: isLoadingMeta } = useContactMeta();
    const isLoading = isLoadingContext || isLoadingProperties || isLoadingMeta;
    
    const structure: ContactLayout = useMemo(() => {
      return settings?.mapping_contact
        ? JSON.parse(settings.mapping_contact) as ContactLayout
        : STRUCTURE.CONTACT
    }, [settings?.mapping_contact]);

    const onChangeStructure = useCallback((structure: ContactLayout) => {
      client?.setAdminSetting(JSON.stringify(structure));
    }, [client]);

    if (!client || !settings || isLoading) {
      return (
        <LoadingSpinner/>
      );
    }

    return (
        <ContactMapping
          meta={contactMetaMap}
          structure={structure}
          properties={properties}
          onChangeStructure={onChangeStructure}
        />
    );
};

export { ContactMappingPage };
