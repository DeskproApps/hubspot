import get from "lodash/get";
import type { HubSpotError } from "./types";
import { ProxyResponse } from "@deskpro/app-sdk";

export const isResponseError = (response: ProxyResponse) => {
    return (response.status < 200 || response.status >= 400);
}

export const isValidationError = (err?: HubSpotError|Error) => {
    return (get(err, ["status"], null) === "error") && (get(err, ["category"], null) === "VALIDATION_ERROR");
};

export const isConflictError = (err?: HubSpotError|Error) => {
    return (get(err, ["status"], null) === "error") && (get(err, ["category"], null) === "CONFLICT");
};
