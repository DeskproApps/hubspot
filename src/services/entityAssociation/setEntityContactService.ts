import { IDeskproClient } from "@deskpro/app-sdk";
import { HUBSPOT_ENTITY } from "./constants";
import type { DeskproUser } from "../../types";
import type { Contact } from "../hubspot/types";

const setEntityContactService = (
    client: IDeskproClient,
    deskproUserId: DeskproUser["id"],
    contactId: Contact["id"],
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    metaData?: any,
) => {
    return client.getEntityAssociation(HUBSPOT_ENTITY, deskproUserId)
        .set(contactId, metaData);
};

export { setEntityContactService };
