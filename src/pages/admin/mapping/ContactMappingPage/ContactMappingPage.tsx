import { useState, useCallback } from "react";
import {
  LoadingSpinner,
  useInitialisedDeskproAppClient,
} from "@deskpro/app-sdk";
import { useAppContext } from "../../../../hooks";
import { useProperties } from "./hooks";
import { STRUCTURE, TABS } from "../../../../constants";
import { ContactMapping } from "../../../../components";
import type { FC } from "react";
import type { TabBarItemType } from "@deskpro/deskpro-ui";

const tabs: TabBarItemType[] = [
  { label: "Contact Home Screen" },
  { label: "Contact View Screen" },
];

const ContactMappingPage: FC = () => {
    const { settings } = useAppContext();
    const { isLoading, properties } = useProperties();
    const [activeTab, setActiveTab] = useState<number>(TABS.HOME);
    const [structure, setStructure] = useState<{ home: string[][], view: string[][] }>(settings?.mapping_contact
      ? JSON.parse(settings.mapping_contact)
      : STRUCTURE.CONTACT
    );

    useInitialisedDeskproAppClient((client) => {
        client.setAdminSetting(JSON.stringify(structure));
    }, [structure]);

    const onChangeHome = useCallback((home: string[][]) => {
        setStructure((structure) => ({ ...structure, home }));
    }, []);

    const onChangeView = useCallback((view: string[][]) => {
      setStructure((structure) => ({ ...structure, view }));
    }, []);

    if (isLoading) {
      return (
        <LoadingSpinner/>
      );
    }

    return (
        <ContactMapping
          structure={structure}
          properties={properties}
          onChangeHome={onChangeHome}
          onChangeView={onChangeView}
          activeTab={activeTab}
          tabs={tabs}
          onChangeTab={setActiveTab}
        />
    );
};

export { ContactMappingPage };
