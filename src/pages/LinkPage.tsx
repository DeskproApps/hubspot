import { useState, useCallback } from "react";
import type { FC, ChangeEvent } from "react";
import { useDebouncedCallback } from "use-debounce";
import { useNavigate } from "react-router-dom";
import {
    Stack,
    Button,
    Context,
    HorizontalDivider,
    useDeskproElements,
    useDeskproAppClient,
    useDeskproLatestAppContext,
} from "@deskpro/app-sdk";
import { setEntityContact } from "../services/entityAssociation";
import { searchContactsByService } from "../services/hubspot";
import { useSetAppTitle } from "../hooks";
import {
    NoFound,
    Loading,
    InputSearch,
    BaseContainer,
} from "../components/common";
import { ContactItem } from "../components/Link";
import type { Contact } from "../services/hubspot/types";
import type { ContextData } from "../types";

const LinkPage: FC = () => {
    const navigate = useNavigate();
    const { client } = useDeskproAppClient();
    const { context } = useDeskproLatestAppContext();

    const [searchQuery, setSearchQuery] = useState<string>("");
    const [contacts, setContacts] = useState<Contact[]>([]);
    const [selectedContactId, setSelectedContactId] = useState<Contact['id']>('');
    const [loading, setLoading] = useState<boolean>(false);

    const deskproUserId = (context as Context<ContextData>)?.data?.user.id;

    useSetAppTitle("Add contact");

    useDeskproElements(({ deRegisterElement }) => {
        deRegisterElement("home");
        deRegisterElement("menu");
    });

    const searchInHubspot = useDebouncedCallback<(q: string) => void>((q) => {
        if (!client) {
            return;
        }

        if (!q || q.length < 2) {
            setContacts([]);
            return;
        }

        setLoading(true);

        searchContactsByService(client, q)
            .then(({ results }) => setContacts(results))
            .catch(() => {})
            .finally(() => setLoading(false));
    }, 500);

    const onClearSearch = () => {
        setSearchQuery('');
        setContacts([]);
    };

    const onChangeSearch = ({ target: { value: q }}: ChangeEvent<HTMLInputElement>) => {
        setSearchQuery(q);
        searchInHubspot(q);
    };

    const onChangeSelectedCustomer = ({ target: { value } }: ChangeEvent<HTMLInputElement>) => {
        if (selectedContactId === value) {
            setSelectedContactId('');
        } else {
            setSelectedContactId(value);
        }
    }

    const onLinkContact = useCallback(() => {
        if (!client || !deskproUserId || !selectedContactId) {
            return;
        }

        setEntityContact(client, deskproUserId, selectedContactId)
            // eslint-disable-next-line @typescript-eslint/ban-ts-comment
            // @ts-ignore
            .then((isSuccess: boolean) => {
                if (isSuccess) {
                    navigate("/home");
                }
            })
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [client, deskproUserId, selectedContactId]);

    return (
        <BaseContainer>
            <InputSearch
                value={searchQuery}
                onChange={onChangeSearch}
                onClear={onClearSearch}
            />
            {loading
                ? (<Loading/>)
                : (
                    <>
                        {!!contacts.length && contacts.map((contact) => (
                           <ContactItem
                               key={contact.id}
                               checked={selectedContactId === contact.id}
                               onChange={onChangeSelectedCustomer}
                               {...contact}
                           />
                        ))}
                        <HorizontalDivider style={{ margin: "10px 0" }} />
                        {!contacts.length && (
                            <NoFound text="No matching contacts found. Please try again." />
                        )}
                    </>
                )
            }
            <Stack justify="space-between" style={{ margin: "14px 0 8px" }}>
                <Button
                    text="Link Contact"
                    onClick={onLinkContact}
                />
            </Stack>
            <br />
            <br />
            <br />
            <br />
        </BaseContainer>
    );
};

export { LinkPage };
