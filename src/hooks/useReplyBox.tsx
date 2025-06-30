import { createContext, useCallback, useContext } from 'react';
import { GetStateResponse, IDeskproClient, TargetAction, useDeskproAppClient, useDeskproAppEvents, useDeskproLatestAppContext, useInitialisedDeskproAppClient } from '@deskpro/app-sdk';
import { Contact } from '../services/hubspot/types';
import { Settings } from '../types';
import { useDebouncedCallback } from 'use-debounce';
import { match } from 'ts-pattern';
import { queryClient } from '../query';
import { createNoteService, setEntityAssocService } from '../services/hubspot';
import { getNoteValues } from '../components/NoteForm';

export type ReplyBox = 'note' | 'email';

export type GetSelectionState = (contactID: Contact['id'], type: ReplyBox) => void | Promise<Array<GetStateResponse<string>>>;

export type SetSelectionState = (contactID: Contact['id'], selected: boolean, type: ReplyBox) => void | Promise<{ isSuccess: boolean } | void>;

export type DeleteSelectionState = (contactID: Contact['id'], type: ReplyBox) => void | Promise<boolean | void>;

const noteKey = (contactID: Contact['id'] | '*') => `hubspot/notes/selection/${contactID}`;

const emailKey = (contactID: Contact['id'] | '*') => `hubspot/emails/selection/${contactID}`;

function registerReplyBoxNotesAdditionsTargetAction(
    client: IDeskproClient,
    contactID: Contact['id']
) {
    if (!client) {
        return;
    };

    if (!contactID) {
        return client.deregisterTargetAction('hubspotReplyBoxNoteAdditions');
    };

    return Promise.all([contactID].map(ID => client.getState<{selected: boolean}>(noteKey(ID))))
        .then(flags => {
            client.registerTargetAction('hubspotReplyBoxNoteAdditions', 'reply_box_note_item_selection', {
                title: 'Add to HubSpot',
                payload: [contactID].map((ID, index) => ({
                    id: ID,
                    title: 'test title note',
                    selected: flags[index][0]?.data?.selected ?? false
                }))
            });
        });
};

function registerReplyBoxEmailsAdditionsTargetAction(
    client: IDeskproClient,
    contactID: Contact['id']
) {
    if (!client) {
        return;
    };

    if (!contactID) {
        return client.deregisterTargetAction('hubspotReplyBoxEmailAdditions');
    };

    return Promise.all([contactID].map(ID => client.getState<{selected: boolean}>(emailKey(ID))))
        .then(flags => {
            client.registerTargetAction('hubspotReplyBoxEmailAdditions', 'reply_box_email_item_selection', {
                title: 'Add to HubSpot',
                payload: [contactID].map((ID, index) => ({
                    id: ID,
                    title: 'test title email',
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
        if (!client) {
            return;
        };

        const key = type === 'note' ? noteKey : emailKey;

        return client.getState(key(contactID));
    }, [client]);

    const setSelectionState: SetSelectionState = useCallback((contactID, selected, type) => {
        if (!client) {
            return;
        };

        console.log('Client is available:', shouldLogNote, shouldLogEmail, type, contactID);

        if (shouldLogNote && type === 'note') {
            console.log('Logging note selection:', contactID, selected);
            return client.setState(noteKey(contactID), { id: contactID, selected })
                .then(() => registerReplyBoxNotesAdditionsTargetAction(client, contactID));
        };

        if (shouldLogEmail && type === 'email') {
            console.log('Logging email selection:', contactID, selected);
            return client.setState(emailKey(contactID), { id: contactID, selected })
                .then(() => registerReplyBoxEmailsAdditionsTargetAction(client, contactID));
        };
    }, [client, shouldLogNote, shouldLogEmail]);

    const deleteSelectionState: DeleteSelectionState = useCallback((contactID, type) => {
        if (!client) {
            return;
        };

        const key = type === 'note' ? noteKey : emailKey;

        return client.deleteState(key(contactID))
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

    const debounceTargetAction = useDebouncedCallback<(action: TargetAction) => void>(action => match(action.name)
        .with('hubspotReplyBoxNoteAdditions', () => {
            action.payload.forEach((selection: { id: string; selected: boolean }) => {

                client?.setState(noteKey(selection.id), { id: selection.id, selected: selection.selected })
                    .then((result) => {
                        if (result.isSuccess) {
                            registerReplyBoxNotesAdditionsTargetAction(client, selection.id);
                        }
                    });
            });
        })
        .with('hubspotOnReplyBoxNote', () => {
            if (!client) {
                return;
            };

            const { note } = action.payload;

            client.setBlocking(true);
            client.getState<{ id: string; selected: boolean }>(noteKey('*'))
                .then(selections => {
                    const contactIDs = selections
                        .filter(({ data }) => data?.selected)
                        .map(({ data }) => data?.id);
                    const contactID = contactIDs[0];

                    if (!contactID) {
                        return;
                    };

                    return Promise.all(
                        contactIDs.map(() => createNoteService(client, getNoteValues({
                            note: `Note Made in Deskpro: ${note}`,
                            files: []
                        }, [])))
                    )
                        .then(notes => {
                            notes.forEach(note => {
                                setEntityAssocService(client, 'notes', note.id, 'contact', contactID, 'note_to_contact');
                            });
                        })
                        .then(() => {queryClient.invalidateQueries()});
                })
                .finally(() => {
                    client.setBlocking(false);
                });
        })
        .with('hubspotReplyBoxEmailAdditions', () => {
            action.payload.forEach((selection: { id: string; selected: boolean }) => {

            client?.setState(emailKey(selection.id), { id: selection.id, selected: selection.selected })
                .then((result) => {
                    if (result.isSuccess) {
                        registerReplyBoxEmailsAdditionsTargetAction(client, selection.id);
                    }
                });
            });
        })
        .with('hubspotOnReplyBoxEmail', () => {
            if (!client) {
                return;
            };

            const { email } = action.payload;

            client.setBlocking(true);
            client.getState<{ id: string; selected: boolean }>(emailKey('*'))
                .then(selections => {
                    const contactIDs = selections
                        .filter(({ data }) => data?.selected)
                        .map(({ data }) => data?.id);
                    const contactID = contactIDs[0];

                    if (!contactID) {
                        return;
                    };

                    return Promise.all(
                        contactIDs.map(() => createNoteService(client, getNoteValues({
                            note: `Email Sent from Deskpro: ${email}`,
                            files: []
                        }, [])))
                    )
                        .then(notes => {
                            notes.forEach(note => {
                                setEntityAssocService(client, 'notes', note.id, 'contact', contactID, 'note_to_contact');
                            });
                        })
                        .then(() => {queryClient.invalidateQueries()});
                })
                .finally(() => {
                    client.setBlocking(false);
                });
        })
        .run(),
        200
    );

    useDeskproAppEvents({
        onTargetAction: debounceTargetAction
    }, [context?.data]);

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