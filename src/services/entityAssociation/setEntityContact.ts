import { IDeskproClient } from "@deskpro/app-sdk";
import { HUBSPOT_ENTITY } from "./constants";
import type { DeskproUser, EntityMetadata } from "../../types";
import type { Contact } from "../hubspot/types";

const setEntityContact = (
    client: IDeskproClient,
    deskproUserId: DeskproUser["id"],
    contactId: Contact["id"],
    metaData?: EntityMetadata,
) => {
    return client.getEntityAssociation(HUBSPOT_ENTITY, deskproUserId)
        .set(contactId, metaData);
};

export { setEntityContact };
