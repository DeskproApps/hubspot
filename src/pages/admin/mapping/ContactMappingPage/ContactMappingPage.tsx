import { useMemo, useCallback } from "react";
import {
  LoadingSpinner,
  useDeskproAppClient,
} from "@deskpro/app-sdk";
import { useAppContext } from "../../../../hooks";
import { useProperties } from "./hooks";
import { STRUCTURE } from "../../../../constants";
import { ContactMapping } from "../../../../components";
import type { FC } from "react";

const ContactMappingPage: FC = () => {
    const { client } = useDeskproAppClient();
    const { settings, isLoading: isLoadingContext } = useAppContext();
    const { properties, isLoading: isLoadingProperties } = useProperties();
    const isLoading = isLoadingContext || isLoadingProperties;
    
    const structure: { home: string[][], view: string[][] } = useMemo(() => {
      return settings?.mapping_contact
        ? JSON.parse(settings.mapping_contact)
        : STRUCTURE.CONTACT
    }, [settings?.mapping_contact]);

    const onChangeStructure = useCallback((structure: { home: string[][], view: string[][] }) => {
      client?.setAdminSetting(JSON.stringify(structure));
    }, [client]);

    if (!client || !settings || isLoading) {
      return (
        <LoadingSpinner/>
      );
    }

    return (
        <ContactMapping
          structure={structure}
          properties={properties}
          onChangeStructure={onChangeStructure}
        />
    );
};

export { ContactMappingPage };
