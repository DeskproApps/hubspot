import { useState, useCallback } from "react";
import { useDeskproAppClient, useDeskproLatestAppContext } from "@deskpro/app-sdk";
import { queryClient, QueryKey } from "../query";
import { createNoteService, setEntityAssocService } from "../services/hubspot";
import { parseDateTime } from "../utils/date";
import type { ContextData, Settings } from "../types";
import type { Contact } from "../services/hubspot/types";

const getLinkedMessage = (userId: string, fullName: string, link?: string): string => {
    return `Linked to Deskpro user ${userId} ${fullName} ${!link ? "" : link}`;
};

const getUnlinkedMessage = (userId: string, fullName: string, link?: string): string => {
    return `Unlinked from Deskpro user ${userId} ${fullName} ${!link ? "" : link}`;
};

const useLinkUnlinkNote = () => {
    const { client } = useDeskproAppClient();
    const { context } = useDeskproLatestAppContext<ContextData, Settings>();
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const dpUser = context?.data?.user;
    const isDisable = Boolean(context?.settings?.default_dont_add_note_when_linking_contact);

    const linkContactFn = useCallback((contactId: Contact["id"]) => {
        if (isDisable) {
            return Promise.resolve();
        }

        if (!client || !dpUser?.id || !dpUser?.name || !contactId) {
            return Promise.resolve();
        }

        setIsLoading(true);
        return createNoteService(client, {
            hs_note_body: getLinkedMessage(dpUser.id, dpUser.name),
            hs_timestamp: parseDateTime(new Date()) as string,
        })
            .then(({ id }) => setEntityAssocService(client, "notes", id, "contacts", contactId, "note_to_contact"))
            .then(() => queryClient.refetchQueries([QueryKey.NOTES, "contacts", contactId, "notes"]))
            .catch(() => {})
            .finally(() => setIsLoading(false))
    }, [client, dpUser, isDisable]);

    const unlinkContactFn = useCallback((contactId: Contact["id"]) => {
        if (isDisable) {
            return Promise.resolve();
        }

        if (!client || !dpUser?.id || !dpUser?.name || !contactId) {
            return Promise.resolve();
        }

        setIsLoading(true);
        return createNoteService(client, {
            hs_note_body: getUnlinkedMessage(dpUser.id, dpUser.name),
            hs_timestamp: parseDateTime(new Date()) as string,
        })
            .then(({ id }) => setEntityAssocService(client, "notes", id, "contacts", contactId, "note_to_contact"))
            .then(() => queryClient.refetchQueries([QueryKey.NOTES, "contacts", contactId, "notes"]))
            .catch(() => {})
            .finally(() => setIsLoading(false))
    }, [client, dpUser, isDisable]);

    return {
        isLoading, linkContactFn, unlinkContactFn,
    };
};

export { useLinkUnlinkNote };
