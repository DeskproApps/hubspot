import get from "lodash/get";
import { HubSpotError } from "./types";

export const isResponseError = (response: Response) => {
    return (response.status < 200 || response.status >= 400);
}

export const isValidationError = (err?: HubSpotError|Error) => {
    return (get(err, ["status"], null) === "error") && (get(err, ["category"], null) === "VALIDATION_ERROR");
};
