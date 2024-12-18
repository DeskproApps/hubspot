import { useMemo } from "react";
import { useDeskproLatestAppContext } from "@deskpro/app-sdk";
import { useQueryWithClient } from "../hooks";
import {
    getContactService,
    getAccountInfoService,
    getPropertiesMetaService,
} from "../services/hubspot";
import { QueryKey } from "../query";
import { getScreenStructure, flatten } from "../utils";
import type { ContextData, Settings } from "../types";
import type { Contact, AccountInto, PropertyMeta } from "../services/hubspot/types";
import type { Layout } from "../components/common/Builder";

type UseContact = (contactId?: Contact["id"]) => {
    isLoading: boolean;
    accountInfo: AccountInto;
    contact: Contact["properties"];
    structure: Layout;
    contactMetaMap: Record<PropertyMeta["fieldType"], PropertyMeta>;
};

const useContact: UseContact = (contactId) => {
    const { context } = useDeskproLatestAppContext<ContextData, Settings>();
    const structure = getScreenStructure(context?.settings, "contact", "view");

    const contact = useQueryWithClient(
        [QueryKey.CONTACT, contactId],
        (client) => getContactService(client, contactId as Contact["id"], flatten(structure)),
        { enabled: Boolean(contactId) },
    );

    const accountInfo = useQueryWithClient(
        [QueryKey.ACCOUNT_INFO],
        getAccountInfoService,
    );

    const contactPropertiesMeta = useQueryWithClient(
        [QueryKey.PROPERTIES_META, "contact"],
        (client) => getPropertiesMetaService(client, "contacts"),
    );

    const contactMetaMap = useMemo(() => {
        return (contactPropertiesMeta.data?.results ?? []).reduce<Record<PropertyMeta["fieldType"], PropertyMeta>>((acc, meta) => {
            if (!acc[meta.name]) {
                acc[meta.name] = meta;
            }
            return acc;
        }, {});
    }, [contactPropertiesMeta.data?.results]);

    return {
        isLoading: !context && [contact, contactPropertiesMeta, accountInfo].some(({ isLoading }) => isLoading),
        accountInfo: accountInfo.data as AccountInto,
        contact: contact.data?.properties as Contact["properties"],
        contactMetaMap,
        structure,
    };
};

export { useContact };
