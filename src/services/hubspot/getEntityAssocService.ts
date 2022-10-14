import { IDeskproClient } from "@deskpro/app-sdk";
import { baseRequest } from "./baseRequest";
import type { EntityType } from "./types";

const getEntityAssocService = <EntityId, Entity>(
    client: IDeskproClient,
    entity: EntityType,
    entityId: string,
    toEntity: EntityType,
) => {
    return baseRequest<{ results: Array<{ id: EntityId, type: Entity }> }>(client, {
        url: `/crm/v3/objects/${entity}/${entityId}/associations/${toEntity}`
    });
};

export { getEntityAssocService };
