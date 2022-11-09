import { useCallback, useState } from "react";
import { useDeskproAppClient, useDeskproLatestAppContext } from "@deskpro/app-sdk";
import { queryClient, QueryKey } from "../query";
import { createNoteService, setEntityAssocService } from "../services/hubspot";
import { parseDateTime } from "../utils/date";

const getLinkedMessage = (userId: string, fullName: string, link?: string): string => {
    return `Linked to Deskpro user ${userId} ${fullName} ${!link ? "" : link}`;
};

const getUnlinkedMessage = (userId: string, fullName: string, link?: string): string => {
    return `Unlinked from Deskpro user ${userId} ${fullName} ${!link ? "" : link}`;
};

const useLinkUnlinkNote = () => {
    const { client } = useDeskproAppClient();
    const { context } = useDeskproLatestAppContext();
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const deskproUser = context?.data?.user;
    const isDisable = Boolean(context?.settings?.default_dont_add_note_when_linking_contact);

    const linkContactFn = useCallback((contactId) => {
        if (isDisable) {
            return Promise.resolve();
        }

        if (!client || !deskproUser.id || !deskproUser.name || !contactId) {
            return Promise.resolve();
        }

        setIsLoading(true);
        return createNoteService(client, {
            hs_note_body: getLinkedMessage(deskproUser.id, deskproUser.name),
            hs_timestamp: parseDateTime(new Date()) as string,
        })
            .then(({ id }) => setEntityAssocService(client, "notes", id, "contacts", contactId, "note_to_contact"))
            .then(() => queryClient.refetchQueries([QueryKey.NOTES, "contacts", contactId, "notes"]))
            .catch(() => {})
            .finally(() => setIsLoading(false))
    }, [client, deskproUser, isDisable]);

    const unlinkContactFn = useCallback((contactId) => {
        if (isDisable) {
            return Promise.resolve();
        }

        if (!client || !deskproUser.id || !deskproUser.name || !contactId) {
            return Promise.resolve();
        }

        setIsLoading(true);
        return createNoteService(client, {
            hs_note_body: getUnlinkedMessage(deskproUser.id, deskproUser.name),
            hs_timestamp: parseDateTime(new Date()) as string,
        })
            .then(({ id }) => setEntityAssocService(client, "notes", id, "contacts", contactId, "note_to_contact"))
            .then(() => queryClient.refetchQueries([QueryKey.NOTES, "contacts", contactId, "notes"]))
            .catch(() => {})
            .finally(() => setIsLoading(false))
    }, [client, deskproUser, isDisable]);

    return {
        isLoading, linkContactFn, unlinkContactFn,
    };
};

export { useLinkUnlinkNote };
