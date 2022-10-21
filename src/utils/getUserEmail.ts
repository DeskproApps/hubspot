import get from "lodash/get";
import { DeskproUser } from "../types";

const getUserEmail = (user?: DeskproUser): string|null => {
    return get(user, ["primaryEmail"], null) || get(user, ["emails", 0], null);
};

export { getUserEmail };
