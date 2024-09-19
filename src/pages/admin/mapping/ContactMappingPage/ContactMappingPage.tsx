import { useCallback } from "react";
import { LoadingSpinner, useDeskproAppClient } from "@deskpro/app-sdk";
import { useAppContext } from "../../../../hooks";
import { useProperties } from "./hooks";
import { STRUCTURE } from "../../../../constants";
import { ContactMapping } from "../../../../components";
import type { FC } from "react";

const ContactMappingPage: FC = () => {
    const { client } = useDeskproAppClient();
    const { settings } = useAppContext();
    const { isLoading, properties } = useProperties();
    const structure = settings?.mapping_contact
        ? JSON.parse(settings.mapping_contact)
        : STRUCTURE.CONTACT;

    const onChange = useCallback((structure: string[][]) => {
        client?.setAdminSetting(JSON.stringify(structure));
    }, [client]);

    if (isLoading) {
      return (
        <LoadingSpinner/>
      );
    }

    return (
        <ContactMapping structure={structure} properties={properties} onChange={onChange}/>
    );
};

export { ContactMappingPage };
