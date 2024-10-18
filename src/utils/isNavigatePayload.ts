import type { EventPayload, NavigateToChangePage } from "../types";

const isNavigatePayload = (
    payload: EventPayload|undefined,
): payload is NavigateToChangePage => {
    return typeof payload === "object" && payload !== null && "path" in payload;
};

export { isNavigatePayload };
