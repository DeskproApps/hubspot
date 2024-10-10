import { useMemo } from "react";
import { useDeskproLatestAppContext } from "@deskpro/app-sdk";
import { useQueryWithClient } from "../../hooks";
import {
    getContactService,
    getAccountInfoService,
    getPropertiesMetaService,
} from "../../services/hubspot";
import { QueryKey } from "../../query";
import { getScreenStructure, flatten } from "../../utils";
import type { Contact, AccountInto, PropertyMeta } from "../../services/hubspot/types";

type UseContact = (contactId?: Contact["id"]) => {
    isLoading: boolean;
    accountInfo: AccountInto;
    contact: Contact["properties"];
    contactMetaMap: Record<PropertyMeta["name"], PropertyMeta>;
};

const useContact: UseContact = (contactId) => {
    const { context } = useDeskproLatestAppContext();
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
        isLoading: !contactId && [contact, contactMetaMap, accountInfo].some(({ isLoading }) => isLoading),
        accountInfo: accountInfo.data as AccountInto,
        contact: contact.data?.properties as Contact["properties"],
        contactMetaMap,
    };
};

export { useContact };
