import { useState, useCallback } from "react";
import type { FC, ChangeEvent } from "react";
import { useDebouncedCallback } from "use-debounce";
import { useNavigate } from "react-router-dom";
import { faSearch, faPlus } from "@fortawesome/free-solid-svg-icons";
import { Stack, Button } from "@deskpro/deskpro-ui";
import {
    Context,
    TwoButtonGroup,
    HorizontalDivider,
    useDeskproElements,
    useDeskproAppClient,
    useDeskproLatestAppContext,
} from "@deskpro/app-sdk";
import { setEntityContact } from "../services/entityAssociation";
import { searchContactsByService } from "../services/hubspot";
import { useSetAppTitle, useLinkUnlinkNote } from "../hooks";
import {
    NoFound,
    Loading,
    InputSearch,
    BaseContainer,
} from "../components/common";
import { ContactItem } from "../components/Link";
import { useLinkContact } from "../hooks";
import { getEntityMetadata } from "../utils";
import type { Contact } from "../services/hubspot/types";
import type { ContextData } from "../types";

const LinkPage: FC = () => {
    const navigate = useNavigate();
    const { client } = useDeskproAppClient();
    const { context } = useDeskproLatestAppContext();
    const { isLoading, linkContactFn } = useLinkUnlinkNote();
    const { getContactInfo } = useLinkContact();

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

    const onChangeSelectedCustomer = (contactId: Contact["id"]) => {
        if (selectedContactId === contactId) {
            setSelectedContactId('');
        } else {
            setSelectedContactId(contactId);
        }
    }

    const onLinkContact = useCallback(() => {
        if (!client || !deskproUser?.id || !selectedContactId) {
            return;
        }

        setLoading(true);
        getContactInfo(selectedContactId)
            .then((data) => {
                return setEntityContact(client, deskproUser.id, selectedContactId, getEntityMetadata(data));
            })
            .then(() => {
                return linkContactFn(selectedContactId).then(() => navigate("/home"));
            })
            .catch(() => ({}))
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
                    disabled={loading || isLoading || !selectedContactId}
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
