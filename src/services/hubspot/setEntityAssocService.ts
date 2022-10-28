import { IDeskproClient } from "@deskpro/app-sdk";
import { baseRequest } from "./baseRequest";
import type { EntityType, AssociationTypes } from "./types";

const setEntityAssocService = (
    client: IDeskproClient,
    entity: EntityType,
    entityId: string,
    toEntity: EntityType,
    toEntityId: string,
    associationType: AssociationTypes,
) => {
    return baseRequest(client, {
        url: `/crm/v3/objects/${entity}/${entityId}/associations/${toEntity}/${toEntityId}/${associationType}`,
        method: "PUT",
    });
};

export { setEntityAssocService };
