import { IDeskproClient } from "@deskpro/app-sdk";
import { getContactsByEmailService } from "./searchContactsService";

const checkAuthService = (client: IDeskproClient): Promise<boolean> => {
    return getContactsByEmailService(client, "just@for.ping")
        .then(() => true)
        .catch(() => false);
};

export { checkAuthService };
