import { IDeskproClient } from "@deskpro/app-sdk";
import { getContactsByEmailService } from "./searchContactsService";

const checkAuthService = (client: IDeskproClient) => {
    return getContactsByEmailService(client, "just@for.ping");
};

export { checkAuthService };
