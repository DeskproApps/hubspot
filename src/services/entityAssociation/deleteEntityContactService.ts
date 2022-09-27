import { IDeskproClient } from "@deskpro/app-sdk";
import { HUBSPOT_ENTITY } from "./constants";
import { DeskproUser } from "../../types";
import { Contact } from "../hubspot/types";

const deleteEntityContactService = (
    client: IDeskproClient,
    deskproUserId: DeskproUser["id"],
    contactId: Contact["id"],
) => {
    return client
        .getEntityAssociation(HUBSPOT_ENTITY, deskproUserId)
        .delete(contactId);
};

export { deleteEntityContactService };
