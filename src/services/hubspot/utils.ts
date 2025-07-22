import type { HubSpotError } from "./types";

export const isResponseError = (response: Response) => {
    return (response.status < 200 || response.status >= 400);
}

export const isValidationError = (err?: HubSpotError|Error) => {
    const error = err as Partial<HubSpotError>;

    return (error?.status ?? null) === "error" && (error?.category ?? null) === "VALIDATION_ERROR";
};

export const isConflictError = (err?: HubSpotError|Error) => {
    const error = err as Partial<HubSpotError>;

    return (error?.status ?? null) === "error" && (error?.category ?? null) === "CONFLICT";
};