import {
    useDeskproLatestAppContext,
    useInitialisedDeskproAppClient,
} from "@deskpro/app-sdk";
import { getEntityContactList, setEntityContact } from "../services/entityAssociation";
import { getContactsByEmailService } from "../services/hubspot";
import { getUserEmail } from "../utils";
import type { UserContext } from "../types";

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
    const userEmail = getUserEmail(context?.data?.user);

    useInitialisedDeskproAppClient((client) => {
        if (!isAuth || !userId) {
            return;
        }

        if (!userEmail) {
            onNoLinkedItemsFn();
            return;
        }

        (async () => {
            const contactIds = await getEntityContactList(client, userId);

            if (contactIds.length === 1) {
                onExistLinkedItemsFn();
                return;
            }

            const { results } = await getContactsByEmailService(client, userEmail);

            if (results.length === 0 || results.length > 1) {
                onNoLinkedItemsFn();
                return;
            }

            // eslint-disable-next-line @typescript-eslint/ban-ts-comment
            // @ts-ignore
            const isSuccess: boolean = await setEntityContact(client, userId, results[0].id);

            if (isSuccess) {
                onExistLinkedItemsFn();
            } else {
                onNoLinkedItemsFn();
            }
        })();
    }, [isAuth, userId, userEmail]);
};

export { useCheckLinkedContact };
