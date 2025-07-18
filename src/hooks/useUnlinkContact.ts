import { useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { useDeskproAppClient, useDeskproLatestAppContext } from "@deskpro/app-sdk";
import { deleteEntityContact } from "../services/entityAssociation";
import { useLinkUnlinkNote } from "./useLinkUnlinkNote";
import { useAsyncError } from "./useAsyncError";
import type { Contact } from "../services/hubspot/types";
import type { ContextData, Settings } from "../types";

const useUnlinkContact = () => {
    const navigate = useNavigate();
    const { client } = useDeskproAppClient();
    const { context } = useDeskproLatestAppContext<ContextData, Settings>();
    const { asyncErrorHandler } = useAsyncError();
    const { unlinkContactFn } = useLinkUnlinkNote();
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const dpUserId = context?.data?.user?.id;

    const unlinkContact = useCallback((contactId: Contact["id"]) => {
        if (!client || !dpUserId || !contactId) {
            return;
        }

        setIsLoading(true);

        deleteEntityContact(client, dpUserId, contactId)
            .then(() => unlinkContactFn(contactId))
            .then(() => navigate("/link"))
            .catch(asyncErrorHandler)
            .finally(() => setIsLoading(false));
    }, [client, dpUserId, navigate, asyncErrorHandler, unlinkContactFn]);

    return { unlinkContact, isLoading };
};

export { useUnlinkContact };
