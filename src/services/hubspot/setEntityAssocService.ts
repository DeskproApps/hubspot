import { IDeskproClient } from "@deskpro/app-sdk";
import { baseRequest } from "./baseRequest";
import type { EntityType } from "./types";

const setEntityAssocService = (
    client: IDeskproClient,
    entity: EntityType,
    entityId: string,
    toEntity: EntityType,
    toEntityId: string,
) => {
    return baseRequest(client, {
        url: `/crm/v4/objects/${entity}/${entityId}/associations/${toEntity}/${toEntityId}`,
        method: "PUT",
    });
};

export { setEntityAssocService };
