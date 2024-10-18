import { getEntityContactList, deleteEntityContact, setEntityContact } from "../services/entityAssociation";
import { getContactsByEmailService } from "../services/hubspot";
import { getEntityMetadata } from "../utils";
import type { IDeskproClient } from "@deskpro/app-sdk";
import type { DeskproUser, ContactDeps } from "../types";
import type { Contact } from "../services/hubspot/types";

const tryToLinkAutomatically = async (
    client: IDeskproClient,
    dpUser: DeskproUser,
    getContactInfo: (contactId: Contact["id"]) => Promise<ContactDeps>,
    linkContactFn: (contactId: Contact["id"]) => Promise<void>,
) => {
    try {
        const contactIds = await getEntityContactList(client, dpUser.id);

        if (contactIds?.length === 1) {
            return;
        }
        
        if (contactIds?.length > 1) {
            await Promise.all(contactIds.map((contactId) => {
                return deleteEntityContact(client, dpUser.id, contactId);
            }));
        }

        const { results } = await getContactsByEmailService(client, dpUser.primaryEmail);

        if (results?.length !== 1) {
            return;
        }
        
        const contactId = results[0].id;
        const contact = await getContactInfo(contactId);
        
        return Promise.all([
            linkContactFn(contactId),
            setEntityContact(client, dpUser.id, contactId, getEntityMetadata(contact)),
        ]);
    } catch (e) {
        return;
    }
};

export { tryToLinkAutomatically };
