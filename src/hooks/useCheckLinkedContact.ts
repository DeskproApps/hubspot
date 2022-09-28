import { useState } from "react";
import {
    useDeskproLatestAppContext,
    useInitialisedDeskproAppClient,
} from "@deskpro/app-sdk";
import { UserContext } from "../types";
import { getEntityContactList, setEntityContact } from "../services/entityAssociation";
import { getContactsByEmailService, getContactService } from "../services/hubspot";
import type { Contact } from "../services/hubspot/types";

type UseCheckLinkedContact = (
    isAuth: boolean|null,
    onExistLinkedItemsFn: () => void,
    onNoLinkedItemsFn: () => void,
) => void;

/**
 * Check is already linked contact or try linking automatically and redirect to LinkPage or HomePage
 */
const useCheckLinkedContact: UseCheckLinkedContact = (
    isAuth,
    onExistLinkedItemsFn,
    onNoLinkedItemsFn,
) => {
    const { context } = useDeskproLatestAppContext() as { context: UserContext|null };

    const userId = context?.data?.user.id;
    const email = context?.data?.user.emails[0];

    useInitialisedDeskproAppClient((client) => {
        if (!isAuth || !userId || !email) {
            return;
        }

        (async () => {
            const contactIds = await getEntityContactList(client, userId);

            if (contactIds.length === 1) {
                onExistLinkedItemsFn();
                return;
            }

            const { results } = await getContactsByEmailService(client, email);

            if (results.length === 0 || results.length > 1) {
                onNoLinkedItemsFn();
                return;
            }

            const isSuccess = await setEntityContact(client, userId, results[0].id);

            if (isSuccess) {
                onExistLinkedItemsFn();
            } else {
                onNoLinkedItemsFn();
            }
        })();
    }, [isAuth, userId, email]);
};

export { useCheckLinkedContact };
