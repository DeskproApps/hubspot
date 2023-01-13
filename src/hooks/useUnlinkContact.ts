import { useCallback } from "react";
import {
    Context,
    useDeskproAppClient,
    useDeskproLatestAppContext,
} from "@deskpro/app-sdk";
import { deleteEntityContact } from "../services/entityAssociation";
import type { Contact } from "../services/hubspot/types";
import type { ContextData, UserContext } from "../types";

const useUnlinkContact = () => {
    const { client } = useDeskproAppClient();
    const { context } = useDeskproLatestAppContext() as { context: UserContext };

    const deskproUserId = (context as Context<ContextData>)?.data?.user.id;

    const unlinkContact = useCallback((
        contactId: Contact["id"],
        successFn?: (contactId: Contact["id"]) => void,
    ) => {
        if (!client || !deskproUserId || !contactId) {
            return;
        }

        deleteEntityContact(client, deskproUserId, contactId)
            // eslint-disable-next-line @typescript-eslint/ban-ts-comment
            // @ts-ignore
            .then((isSuccess: boolean) => {
                if (isSuccess) {
                    successFn && successFn(contactId);
                } else {
                    return Promise.resolve();
                }
            })
            .catch(() => {});
    }, [client, deskproUserId]);

    return { unlinkContact };
};

export { useUnlinkContact };
