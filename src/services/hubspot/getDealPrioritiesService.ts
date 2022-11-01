import { IDeskproClient } from "@deskpro/app-sdk";
import { getPropertyService } from "./getPropertyService";
import type { DealPriority } from "./types";

const getDealPrioritiesService = (client: IDeskproClient) => {
    return getPropertyService<DealPriority>(client, "deals", "hs_priority");
};

export { getDealPrioritiesService };
