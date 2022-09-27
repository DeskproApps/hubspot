import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
    useDeskproElements,
    useDeskproLatestAppContext,
    useInitialisedDeskproAppClient,
} from "@deskpro/app-sdk";
import { BaseContainer } from "../components/common";
import { getEntityContactList } from "../services/entityAssociation";
import { useSetAppTitle } from "../hooks";
import type { UserContext } from "../types";
import type { Contact } from "../services/hubspot/types";

const Home = () => {
    const navigate = useNavigate();
    const { context } = useDeskproLatestAppContext() as { context: UserContext };

    const [contactId, setContactId] = useState<Contact["id"]>();

    const userId = context.data?.user.id;

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
                if (contactIds.length > 0) {
                    setContactId(contactIds[0]);
                } else {
                    navigate("/link");
                }
            })
            .catch((err) => {
                console.log(">>> home:entity:catch:", err);
            });
    }, [userId]);

    return (
        <BaseContainer>
            Home Page
        </BaseContainer>
    );
};

export { Home };
