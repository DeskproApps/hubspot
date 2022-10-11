import { IDeskproClient } from "@deskpro/app-sdk";
import { getCallActivityService } from "./getCallActivityService";
import { getEmailActivityService } from "./getEmailActivityService";
import { CallActivity, EmailActivity } from "./types";

type GetActivityService = (
    client: IDeskproClient,
    entity: "email" | "call",
    entityId: CallActivity["id"] | EmailActivity["id"],
) => Promise<any>;

const getActivityService: GetActivityService = async (client, entity, entityId) => {
    const activityService = (entity === "email") ? getEmailActivityService : getCallActivityService;

    return activityService(client, entityId);
};

export { getActivityService };
