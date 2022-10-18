import { IDeskproClient } from "@deskpro/app-sdk";
import { getPropertyService } from "./getPropertyService";
import type { LeadStatus } from "./types";

const getLeadStatusesService = (client: IDeskproClient) => {
    return getPropertyService<LeadStatus>(client, "contacts", "hs_lead_status");
};

export { getLeadStatusesService };
