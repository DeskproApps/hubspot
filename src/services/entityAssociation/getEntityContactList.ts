import { IDeskproClient } from "@deskpro/app-sdk";
import { HUBSPOT_ENTITY } from "./constants";
import { DeskproUser } from "../../types";
import { Contact } from "../hubspot/types";

const getEntityContactList = (
    client: IDeskproClient,
    userId: DeskproUser["id"],
): Promise<Array<Contact["id"]>> => client
    .getEntityAssociation(HUBSPOT_ENTITY, userId)
    .list();

export { getEntityContactList };
