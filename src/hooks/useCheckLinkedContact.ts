import {
    useDeskproLatestAppContext,
    useInitialisedDeskproAppClient,
} from "@deskpro/app-sdk";
import { getEntityContactList, setEntityContact } from "../services/entityAssociation";
import {
    createNoteService,
    setEntityAssocService,
    getContactsByEmailService,
} from "../services/hubspot";
import { getUserEmail, getLinkedMessage } from "../utils";
import { parseDateTime } from "../utils/date";
import { queryClient, QueryKey } from "../query";
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

    const deskproUser = context?.data?.user;
    const userEmail = getUserEmail(context?.data?.user);

    useInitialisedDeskproAppClient((client) => {
        if (!isAuth || !deskproUser?.id) {
            return;
        }

        if (!userEmail) {
            onNoLinkedItemsFn();
            return;
        }

        (async () => {
            const contactIds = await getEntityContactList(client, deskproUser.id);

            if (contactIds.length === 1) {
                onExistLinkedItemsFn();
                return;
            }

            const { results } = await getContactsByEmailService(client, userEmail);

            if (results.length === 0 || results.length > 1) {
                onNoLinkedItemsFn();
                return;
            }

            const contactId = results[0].id;
            // eslint-disable-next-line @typescript-eslint/ban-ts-comment
            // @ts-ignore
            const isSuccess: boolean = await setEntityContact(client, deskproUser.id, contactId);

            if (!isSuccess) {
                onNoLinkedItemsFn();
            } else {
                await createNoteService(client, {
                    hs_note_body: getLinkedMessage(deskproUser.id, deskproUser.name),
                    hs_timestamp: parseDateTime(new Date()) as string,
                })
                    .then(({ id }) => setEntityAssocService(client, "notes", id, "contacts", contactId, "note_to_contact"))
                    .then(() => queryClient.refetchQueries(
                        [QueryKey.NOTES, "contacts", contactId, "notes"],
                    ))
                    .catch(() => {});

                onExistLinkedItemsFn();
            }
        })();
    }, [isAuth, deskproUser, userEmail]);
};

export { useCheckLinkedContact };
