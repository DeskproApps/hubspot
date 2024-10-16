import { useDeskproLatestAppContext } from "@deskpro/app-sdk";
import { useQueryWithClient, useContactMeta } from "../hooks";
import { getContactService, getAccountInfoService } from "../services/hubspot";
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
    contactMetaMap: Record<PropertyMeta["name"], PropertyMeta>;
};

const useContact: UseContact = (contactId) => {
    const { context } = useDeskproLatestAppContext<ContextData, Settings>();
    const structure = getScreenStructure(context?.settings, "contact", "view");
    const meta = useContactMeta();

    const contact = useQueryWithClient(
        [QueryKey.CONTACT, contactId],
        (client) => getContactService(client, contactId as Contact["id"], flatten(structure)),
        { enabled: Boolean(contactId) },
    );

    const accountInfo = useQueryWithClient(
        [QueryKey.ACCOUNT_INFO],
        getAccountInfoService,
    );

    return {
        isLoading: !context && [contact, meta, accountInfo].some(({ isLoading }) => isLoading),
        accountInfo: accountInfo.data as AccountInto,
        contact: contact.data?.properties as Contact["properties"],
        contactMetaMap: meta.contactMetaMap,
        structure,
    };
};

export { useContact };
