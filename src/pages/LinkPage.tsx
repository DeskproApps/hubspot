import { useState, useCallback } from "react";
import type { FC, ChangeEvent } from "react";
import { useDebouncedCallback } from "use-debounce";
import { useNavigate } from "react-router-dom";
import { faSearch, faPlus } from "@fortawesome/free-solid-svg-icons";
import {
    Stack,
    Button,
    Context,
    TwoButtonGroup,
    HorizontalDivider,
    useDeskproElements,
    useDeskproAppClient,
    useDeskproLatestAppContext,
} from "@deskpro/app-sdk";
import { setEntityContact } from "../services/entityAssociation";
import {
    createNoteService,
    setEntityAssocService,
    searchContactsByService,
} from "../services/hubspot";
import { useSetAppTitle } from "../hooks";
import { getLinkedMessage } from "../utils";
import { parseDateTime } from "../utils/date";
import { queryClient, QueryKey } from "../query";
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

    const deskproUser = (context as Context<ContextData>)?.data?.user;

    useSetAppTitle("Add contact");

    useDeskproElements(({ deRegisterElement }) => {
        deRegisterElement("home");
        deRegisterElement("menu");
        deRegisterElement("edit");
        deRegisterElement("externalLink");
    });

    const onNavigateToCreateContact = useCallback(() => {
        navigate("/contacts/create");
    }, [navigate]);

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
        if (!client || !deskproUser?.id || !selectedContactId) {
            return;
        }

        setEntityContact(client, deskproUser.id, selectedContactId)
            // eslint-disable-next-line @typescript-eslint/ban-ts-comment
            // @ts-ignore
            .then((isSuccess: boolean) => isSuccess
                ? createNoteService(client, {
                    hs_note_body: getLinkedMessage(deskproUser.id, deskproUser.name),
                    hs_timestamp: parseDateTime(new Date()) as string,
                })
                : Promise.reject()
            )
            .then(({ id }) => setEntityAssocService(client, "notes", id, "contacts", selectedContactId, "note_to_contact"))
            .then(() => queryClient.refetchQueries(
                [QueryKey.NOTES, "contacts", selectedContactId, "notes"],
            ))
            .then(() => navigate("/home"))
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [client, deskproUser, selectedContactId]);

    return (
        <BaseContainer>
            <TwoButtonGroup
                selected="one"
                oneLabel="Find contact"
                oneIcon={faSearch}
                oneOnClick={() => {}}
                twoLabel="Create contact"
                twoIcon={faPlus}
                twoOnClick={onNavigateToCreateContact}
            />
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
