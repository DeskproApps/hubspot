import { useCallback } from "react";
import get from "lodash/get";
import { useDeskproAppClient } from "@deskpro/app-sdk";
import {
    getContactService,
    getDealsByContactId,
    getCompaniesByContactId,
} from "../services/hubspot";
import type { Contact, Company, Deal } from "../services/hubspot/types";

type ContactDeps = {
    contact?: Contact["properties"],
    companies?: Array<Company["properties"]>,
    deals?: Array<Deal["properties"]>,
};

type UseLinkContact = () => {
    getContactInfo: (contactId: Contact["id"]) => Promise<ContactDeps>,
};

const useLinkContact: UseLinkContact = () => {
    const { client } = useDeskproAppClient();

    const getContactInfo = useCallback((contactId: Contact["id"]): Promise<ContactDeps> => {
        if (!client) {
            return Promise.resolve({});
        }

        return Promise.all([
            getContactService(client, contactId),
            getCompaniesByContactId(client, contactId),
            getDealsByContactId(client, contactId),
        ])
            .then(([contact, companies, deals]) => ({
                contact: get(contact, ["properties"]),
                companies: (get(companies, ["results"], []) || []).map(({ properties }: Company) => properties),
                deals: (get(deals, ["results"], []) || []).map(({ properties }: Deal) => properties),
            }))
            .catch(() => ({}));
    }, [client]);

    return { getContactInfo };
};

export { useLinkContact };
