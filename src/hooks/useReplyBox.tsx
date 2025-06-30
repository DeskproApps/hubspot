import { createContext, useCallback, useContext } from 'react';
import { match } from 'ts-pattern';
import { useDebouncedCallback } from 'use-debounce';
import { GetStateResponse, IDeskproClient, TargetAction, useDeskproAppClient, useDeskproAppEvents, useDeskproLatestAppContext, useInitialisedDeskproAppClient } from '@deskpro/app-sdk';
import { getNoteValues } from '../components/NoteForm';
import { queryClient } from '../query';
import { createNoteService, setEntityAssocService } from '../services/hubspot';
import { Contact } from '../services/hubspot/types';
import { Settings } from '../types';

export type ReplyBox = 'note' | 'email';

type Selection = {
    id: Contact['id'];
    selected: boolean;
};

export type GetSelectionState = (contactID: Contact['id'], type: ReplyBox) => void | Promise<Array<GetStateResponse<string>>>;

export type SetSelectionState = (contactID: Contact['id'], selected: boolean, type: ReplyBox, title: string) => void | Promise<Selection | void>;

export type DeleteSelectionState = (contactID: Contact['id'], type: ReplyBox) => void | Promise<boolean | void>;

const noteKey = (contactID: Contact['id'] | '*') => `hubspot/notes/selection/${contactID}`;

const emailKey = (contactID: Contact['id'] | '*') => `hubspot/emails/selection/${contactID}`;

function registerReplyBoxNotesAdditionsTargetAction(
    client: IDeskproClient,
    contactID: Contact['id'],
    title?: string
) {
    if (!contactID) {
        return client.deregisterTargetAction('hubspotReplyBoxNoteAdditions');
    };

    return Promise.all([contactID].map(ID => client.getState<Selection>(noteKey(ID))))
        .then(flags => {
            client.registerTargetAction('hubspotReplyBoxNoteAdditions', 'reply_box_note_item_selection', {
                title: 'Add to HubSpot',
                payload: [contactID].map((ID, index) => ({
                    id: ID,
                    title: title ?? 'Add Note to HubSpot Contact',
                    selected: flags[index][0]?.data?.selected ?? false
                }))
            });
        });
};

function registerReplyBoxEmailsAdditionsTargetAction(
    client: IDeskproClient,
    contactID: Contact['id'],
    title?: string
) {
    if (!contactID) {
        return client.deregisterTargetAction('hubspotReplyBoxEmailAdditions');
    };

    return Promise.all([contactID].map(ID => client.getState<Selection>(emailKey(ID))))
        .then(flags => {
            client.registerTargetAction('hubspotReplyBoxEmailAdditions', 'reply_box_email_item_selection', {
                title: 'Add to HubSpot',
                payload: [contactID].map((ID, index) => ({
                    id: ID,
                    title: title ?? 'Add Note to HubSpot Contact',
                    selected: flags[index][0]?.data?.selected ?? false
                }))
            });
        });
};

interface IReplyBoxContext {
    getSelectionState: GetSelectionState;
    setSelectionState: SetSelectionState;
    deleteSelectionState: DeleteSelectionState;
};

const ReplyBoxContext = createContext<IReplyBoxContext>({
    getSelectionState: () => {},
    setSelectionState: () => {},
    deleteSelectionState: () => {}
});

export function useReplyBox() {
    return useContext<IReplyBoxContext>(ReplyBoxContext);
};

interface IReplyBoxProvider {
    children: React.ReactNode;
};

export function ReplyBoxProvider({ children }: IReplyBoxProvider) {
    const { client } = useDeskproAppClient();
    const { context } = useDeskproLatestAppContext<unknown, Settings>();
    const shouldLogNote = context?.settings.log_note_as_hubspot_note;
    const shouldLogEmail = context?.settings.log_email_as_hubspot_note;

    const getSelectionState: GetSelectionState = useCallback((contactID, type) => {
        const key = type === 'note' ? noteKey : emailKey;

        return client?.getState(key(contactID));
    }, [client]);

    const setSelectionState: SetSelectionState = useCallback((contactID, selected, type, title) => {
        if (shouldLogNote && type === 'note') {
            return client?.setState(noteKey(contactID), { id: contactID, selected })
                .then(() => registerReplyBoxNotesAdditionsTargetAction(client, contactID, title));
        };

        if (shouldLogEmail && type === 'email') {
            return client?.setState(emailKey(contactID), { id: contactID, selected })
                .then(() => registerReplyBoxEmailsAdditionsTargetAction(client, contactID, title));
        };
    }, [client, shouldLogNote, shouldLogEmail]);

    const deleteSelectionState: DeleteSelectionState = useCallback((contactID, type) => {
        const key = type === 'note' ? noteKey : emailKey;

        return client?.deleteState(key(contactID))
            .then(() => {
                if (type === 'note') {
                    return registerReplyBoxNotesAdditionsTargetAction(client, contactID);
                } else if (type === 'email') {
                    return registerReplyBoxEmailsAdditionsTargetAction(client, contactID);;
                };
            });
    }, [client, shouldLogNote, shouldLogEmail]);

    useInitialisedDeskproAppClient(client => {
        if (shouldLogNote) {
            client.registerTargetAction('hubspotOnReplyBoxNote', 'on_reply_box_note');
        };

        if (shouldLogEmail) {
            client.registerTargetAction('hubspotOnReplyBoxEmail', 'on_reply_box_email');
        };
    }, [shouldLogNote, shouldLogEmail]);

    const handleTargetAction = useCallback((action: TargetAction) => {
        match(action.name)
            .with('hubspotReplyBoxNoteAdditions', () => {
                action.payload.forEach((selection: Selection) => {
                    client?.setState(noteKey(selection.id), { id: selection.id, selected: selection.selected })
                        .then(result => {
                            if (result.isSuccess) {
                                registerReplyBoxNotesAdditionsTargetAction(client, selection.id);
                            };
                        });
                });
            })
            .with('hubspotOnReplyBoxNote', () => {
                const { note } = action.payload;

                client?.setBlocking(true);
                client?.getState<Selection>(noteKey('*'))
                    .then(selections => {
                        const contactIDs = selections
                            .filter(({ data }) => data?.selected)
                            .map(({ data }) => data?.id);

                        if (!contactIDs.length) return;

                        return createNoteService(client, getNoteValues({
                            note: `Note Made in Deskpro: ${note}`,
                            files: []
                        }, []))
                            .then(note => Promise.all(
                                contactIDs.map(ID => setEntityAssocService(client, 'notes', note.id, 'contact', ID as string, 'note_to_contact'))
                            ))
                            .then(() => {queryClient.invalidateQueries()});
                    })
                    .finally(() => {
                        client.setBlocking(false);
                    });
            })
            .with('hubspotReplyBoxEmailAdditions', () => {
                action.payload.forEach((selection: Selection) => {
                    client?.setState(emailKey(selection.id), { id: selection.id, selected: selection.selected })
                        .then(result => {
                            if (result.isSuccess) {
                                registerReplyBoxEmailsAdditionsTargetAction(client, selection.id);
                            };
                        });
                });
            })
            .with('hubspotOnReplyBoxEmail', () => {
                const { email } = action.payload;

                client?.setBlocking(true);
                client?.getState<Selection>(emailKey('*'))
                    .then(selections => {
                        const contactIDs = selections
                            .filter(({ data }) => data?.selected)
                            .map(({ data }) => data?.id);

                        if (!contactIDs.length) return;

                        return createNoteService(client, getNoteValues({
                            note: `Email Sent from Deskpro: ${email}`,
                            files: []
                        }, []))
                            .then(note => Promise.all(
                                contactIDs.map(ID => setEntityAssocService(client, 'notes', note.id, 'contact', ID as string, 'note_to_contact'))
                            ))
                            .then(() => {queryClient.invalidateQueries()});
                    })
                    .finally(() => {
                        client.setBlocking(false);
                    });
            })
            .run();
    }, [client, shouldLogNote, shouldLogEmail]);

    const debounceTargetAction = useDebouncedCallback(handleTargetAction, 200);

    useDeskproAppEvents({
        onTargetAction: debounceTargetAction
    }, [debounceTargetAction]);

    return (
        <ReplyBoxContext.Provider value={{
            setSelectionState,
            getSelectionState,
            deleteSelectionState
        }}>
            {children}
        </ReplyBoxContext.Provider>
    );
};