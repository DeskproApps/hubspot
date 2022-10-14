import { IDeskproClient } from "@deskpro/app-sdk";
import { getAccessTokenInfoService } from "./getAccessTokenInfoService";

const checkAuthService = (client: IDeskproClient): Promise<boolean> => {
    return getAccessTokenInfoService(client)
        .then((data) => Promise.resolve(!!data.user))
        .catch(() => Promise.resolve(false));
};

export { checkAuthService };
