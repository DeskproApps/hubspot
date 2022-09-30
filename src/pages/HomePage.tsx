import { useState } from "react";
import {
    Context,
    useDeskproElements,
    useDeskproLatestAppContext,
    useInitialisedDeskproAppClient,
} from "@deskpro/app-sdk";
import {
    getEntityContactList,
} from "../services/entityAssociation";
import {
    checkAuthService,
    getContactService,
} from "../services/hubspot";
import { useSetAppTitle, useQueryWithClient } from "../hooks";
import { QueryKey } from "../query";
import { Home } from "../components/Home";
import type { UserContext, ContextData } from "../types";
import type { Contact } from "../services/hubspot/types";

const HomePage = () => {
    const { context } = useDeskproLatestAppContext() as { context: UserContext };

    const [contactId, setContactId] = useState<Contact["id"]|null>(null);

    const userId = (context as Context<ContextData>)?.data?.user.id;

    const contact = useQueryWithClient(
        [QueryKey.CONTACT, contactId],
        (client) => getContactService(client, contactId as string),
        { enabled: !!contactId }
    );

    const check = useQueryWithClient(
        [QueryKey.CHECK_AUTH],
        checkAuthService
    )

    console.log(">>> home:", check.data);

    useSetAppTitle("Contact");

    useDeskproElements(({ registerElement }) => {
        registerElement("hubspotMenu", {
            type: "menu",
            items: [{
                title: "Unlink contact",
                payload: {
                    type: "unlink",
                    userId,
                    contactId,
                },
            }],
        });
    }, [userId, contactId]);

    useInitialisedDeskproAppClient((client) => {
        if (!userId) {
            return;
        }

        getEntityContactList(client, userId)
            .then((contactIds) => {
                if (contactIds.length !== 0) {
                    setContactId(contactIds[0]);
                }
            })
    }, [userId]);

    return (
        <Home />
    );
};

export { HomePage };
