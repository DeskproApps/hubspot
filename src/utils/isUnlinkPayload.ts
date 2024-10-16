import type { EventPayload, UnlinkPayload } from "../types";

const isUnlinkPayload = (
    payload: EventPayload
): payload is UnlinkPayload => {
    return payload?.type === "unlink"
      && typeof payload === "object"
      && payload !== null
      && "contactId" in payload;
};

export { isUnlinkPayload };
