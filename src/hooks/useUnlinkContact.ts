import { useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import {
    Context,
    useDeskproAppClient,
    useDeskproLatestAppContext,
} from "@deskpro/app-sdk";
import { deleteEntityContact } from "../services/entityAssociation";
import { useLinkUnlinkNote } from "./useLinkUnlinkNote";
import { useAsyncError } from "./useAsyncError";
import type { Contact } from "../services/hubspot/types";
import type { ContextData, UserContext } from "../types";

const useUnlinkContact = () => {
    const navigate = useNavigate();
    const { client } = useDeskproAppClient();
    const { context } = useDeskproLatestAppContext() as { context: UserContext };
    const { asyncErrorHandler } = useAsyncError();
    const { unlinkContactFn } = useLinkUnlinkNote();
    const [isLoading, setIsLoading] = useState<boolean>(false);

    const deskproUserId = (context as Context<ContextData>)?.data?.user.id;

    const unlinkContact = useCallback((contactId: Contact["id"]) => {
        if (!client || !deskproUserId || !contactId) {
            return;
        }

        setIsLoading(true);

        deleteEntityContact(client, deskproUserId, contactId)
            .then(() => unlinkContactFn(contactId))
            .then(() => navigate("/link"))
            .catch(asyncErrorHandler)
            .finally(() => setIsLoading(false));
    }, [client, deskproUserId, navigate, asyncErrorHandler, unlinkContactFn]);

    return { unlinkContact, isLoading };
};

export { useUnlinkContact };
