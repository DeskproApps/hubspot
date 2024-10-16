import { useNavigate } from "react-router-dom";
import {
    useDeskproLatestAppContext,
    useInitialisedDeskproAppClient,
} from "@deskpro/app-sdk";
import { getEntityContactList  } from "../services/entityAssociation";
import { checkAuthService } from "../services/hubspot";
import { useLinkUnlinkNote } from "./useLinkUnlinkNote";
import { tryToLinkAutomatically } from "../utils";
import { useLinkContact, useAsyncError } from "../hooks";
import type { UserContext } from "../types";

type UseCheckLinkedContact = () => void;

/**
 * Check is already linked contact or try linking automatically and redirect to LinkPage or HomePage
 */
const useCheckLinkedContact: UseCheckLinkedContact = () => {
    const navigate = useNavigate();
    const { context } = useDeskproLatestAppContext();
    const { linkContactFn } = useLinkUnlinkNote();
    const { getContactInfo } = useLinkContact();
    const { asyncErrorHandler } = useAsyncError();

    const dpUser = (context as UserContext|null)?.data?.user;

    useInitialisedDeskproAppClient((client) => {
        if (!dpUser) {
            return;
        }

        checkAuthService(client)
            .then(() => tryToLinkAutomatically(client, dpUser, getContactInfo, linkContactFn))
            .then(() => getEntityContactList(client, dpUser.id))
            .then((entityIds) => navigate(entityIds.length > 0 ? "/home" : "/link"))
            .catch(asyncErrorHandler);
    }, [dpUser, asyncErrorHandler]);
};

export { useCheckLinkedContact };
