import { useState } from "react";
import {
    Context,
    useDeskproElements,
    useDeskproLatestAppContext,
    useInitialisedDeskproAppClient,
} from "@deskpro/app-sdk";
import { BaseContainer } from "../components/common";
import {
    getEntityContactList,
} from "../services/entityAssociation";
import { useSetAppTitle } from "../hooks";
import type { UserContext, ContextData } from "../types";
import type { Contact } from "../services/hubspot/types";

const Home = () => {
    const { context } = useDeskproLatestAppContext() as { context: UserContext };

    const [contactId, setContactId] = useState<Contact["id"]|null>(null);

    const userId = (context as Context<ContextData>).data?.user.id;

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
        <BaseContainer>
            {!contactId
                ? <></>
                : <>HomePage: {contactId}</>
            }
        </BaseContainer>
    );
};

export { Home };
