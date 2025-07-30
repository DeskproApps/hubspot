import { createContext, useCallback, useContext } from 'react';
import { v4 as uuid } from 'uuid';
import { match } from 'ts-pattern';
import { useDebouncedCallback } from 'use-debounce';
import { GetStateResponse, IDeskproClient, TargetAction, useDeskproAppClient, useDeskproAppEvents, useDeskproLatestAppContext, useInitialisedDeskproAppClient } from '@deskpro/app-sdk';
import { getNoteValues } from '../components/NoteForm';
import { queryClient } from '../query';
import { createNoteService, getContactsByEmailService, getContactService, setEntityAssocService } from '../services/hubspot';
import { Contact } from '../services/hubspot/types';
import { Data, Settings } from '../types';

export type ReplyBox = 'note' | 'email';

type Selection = {
  id: Contact['id'];
  selected: boolean;
};

export type GetSelectionState = (contactID: Contact['id'], type: ReplyBox) => void | Promise<Array<GetStateResponse<string>>>;

export type SetSelectionState = (contactID: Contact['id'], selected: boolean, type: ReplyBox) => void | Promise<Selection | void>;

export type DeleteSelectionState = (contactID: Contact['id'], type: ReplyBox) => void | Promise<boolean | void>;

const noteKey = (contactID: Contact['id']) => `hubspot/notes/selection/${contactID}`;

const emailKey = (contactID: Contact['id']) => `hubspot/emails/selection/${contactID}`;

async function getContactName(client: IDeskproClient, contactID: Contact['id']) {
  const contact = await getContactService(client, contactID);
  const name = `${contact.properties.firstname ?? ''} ${contact.properties.lastname ?? ''}` || 'Contact';
  const characterLimit = 14;

  return name.length > characterLimit ? name.slice(0, characterLimit - 3) + '...' : name;
};

async function registerReplyBoxNotesAdditionsTargetAction(client: IDeskproClient, contactID: Contact['id']) {
  if (!contactID) {
    return client.deregisterTargetAction('hubspotReplyBoxNoteAdditions');
  };

  const contactName = await getContactName(client, contactID);

  return Promise.all([contactID].map(ID => client.getState<Selection>(noteKey(ID))))
    .then(flags => {
      void client.registerTargetAction('hubspotReplyBoxNoteAdditions', 'reply_box_note_item_selection', {
        title: 'Add to HubSpot',
        payload: [contactID].map((ID, index) => ({
          id: ID,
          title: contactName,
          selected: flags[index][0]?.data?.selected ?? false
        }))
      });
    });
};

async function registerReplyBoxEmailsAdditionsTargetAction(client: IDeskproClient, contactID: Contact['id']) {
  if (!contactID) {
    return client.deregisterTargetAction('hubspotReplyBoxEmailAdditions');
  };

  const contactName = await getContactName(client, contactID);

  return Promise.all([contactID].map(ID => client.getState<Selection>(emailKey(ID))))
    .then(flags => {
      void client.registerTargetAction('hubspotReplyBoxEmailAdditions', 'reply_box_email_item_selection', {
        title: 'Add to HubSpot',
        payload: [contactID].map((ID, index) => ({
          id: ID,
          title: contactName,
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
  const { context } = useDeskproLatestAppContext<Data, Settings>();
  const shouldLogNote = context?.settings.log_note_as_hubspot_note;
  const shouldLogEmail = context?.settings.log_email_as_hubspot_note;

  const getSelectionState: GetSelectionState = useCallback((contactID, type) => {
    const key = type === 'note' ? noteKey : emailKey;

    return client?.getState(key(contactID));
  }, [client]);

  const setSelectionState: SetSelectionState = useCallback((contactID, selected, type) => {
    if (shouldLogNote && type === 'note') {
      return client?.setState(noteKey(contactID), { id: contactID, selected })
        .then(() => registerReplyBoxNotesAdditionsTargetAction(client, contactID));
    };

    if (shouldLogEmail && type === 'email') {
      return client?.setState(emailKey(contactID), { id: contactID, selected })
        .then(() => registerReplyBoxEmailsAdditionsTargetAction(client, contactID));
    };
  }, [client, shouldLogNote, shouldLogEmail]);

  const deleteSelectionState: DeleteSelectionState = useCallback((contactID, type) => {
    const key = type === 'note' ? noteKey : emailKey;

    return client?.deleteState(key(contactID))
      .then(() => {
        if (type === 'note') {
          return registerReplyBoxNotesAdditionsTargetAction(client, contactID);
        } else if (type === 'email') {
          return registerReplyBoxEmailsAdditionsTargetAction(client, contactID);
        };
      });
  }, [client]);

  useInitialisedDeskproAppClient(client => {
    if (shouldLogNote) {
      void client.registerTargetAction('hubspotOnReplyBoxNote', 'on_reply_box_note');
    };

    if (shouldLogEmail) {
      void client.registerTargetAction('hubspotOnReplyBoxEmail', 'on_reply_box_email');
    };
  }, [shouldLogNote, shouldLogEmail]);

  const handleTargetAction = useCallback((action: TargetAction) => {
    match(action.name)
      .with('hubspotReplyBoxNoteAdditions', () => {
        // eslint-disable-next-line @typescript-eslint/no-unsafe-call, @typescript-eslint/no-unsafe-member-access
        action.payload.forEach((selection: Selection) => {
          void client?.setState(noteKey(selection.id), { id: selection.id, selected: selection.selected })
            .then(result => {
              if (result.isSuccess) {
                void registerReplyBoxNotesAdditionsTargetAction(client, selection.id);
              };
            });
        });
      })
      .with('hubspotOnReplyBoxNote', async () => {
        const userEmail = action.context.data.user.primaryEmail;

        if (!client) return;

        let contactID: Contact['id'] = '';

        const { results } = await getContactsByEmailService(client, userEmail);
        
        contactID = results?.[0]?.id;

        if (!contactID) return;

        void client.setBlocking(true);

        const { note } = action.payload;

        void client.getState<Selection>(noteKey(contactID))
          .then(selections => {
            const contactIDs = selections
              .filter(({ data }) => data?.selected)
              .map(({ data }) => data?.id);

            if (!contactIDs.length) return;

            return createNoteService(
              client,
              getNoteValues({
                note: `Note Made in Deskpro: ${note}`,
                files: []
              }, []),
              uuid()
            )
              .then(note => Promise.all(
                contactIDs.map(ID => setEntityAssocService(client, 'notes', note.id, 'contact', ID as string, 'note_to_contact'))
              ))
              .then(() => {void queryClient.invalidateQueries()});
          })
          .finally(() => {
            void client.setBlocking(false);
          });
      })
      .with('hubspotReplyBoxEmailAdditions', () => {
        // eslint-disable-next-line @typescript-eslint/no-unsafe-call, @typescript-eslint/no-unsafe-member-access
        action.payload.forEach((selection: Selection) => {
          void client?.setState(emailKey(selection.id), { id: selection.id, selected: selection.selected })
            .then(result => {
              if (result.isSuccess) {
                void registerReplyBoxEmailsAdditionsTargetAction(client, selection.id);
              };
            });
        });
      })
      .with('hubspotOnReplyBoxEmail', async () => {
        const userEmail = action.context.data.user.primaryEmail;

        if (!client) return;

        let contactID: Contact['id'] = '';

        const { results } = await getContactsByEmailService(client, userEmail);
        
        contactID = results?.[0]?.id;

        if (!contactID) return;

        void client.setBlocking(true);

        const { email } = action.payload;

        void client.getState<Selection>(emailKey(contactID))
          .then(selections => {
            const contactIDs = selections
              .filter(({ data }) => data?.selected)
              .map(({ data }) => data?.id);

            if (!contactIDs.length) return;

            return createNoteService(
              client,
              getNoteValues({
                note: `Email Sent from Deskpro: ${email}`,
                files: []
              }, []),
              uuid()
            )
              .then(note => Promise.all(
                contactIDs.map(ID => setEntityAssocService(client, 'notes', note.id, 'contact', ID as string, 'note_to_contact'))
              ))
              .then(() => {void queryClient.invalidateQueries()});
          })
          .finally(() => {
            void client.setBlocking(false);
          });
      })
      .run();
  }, [client]);

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