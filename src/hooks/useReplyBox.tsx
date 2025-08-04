import { createContext, useCallback, useContext } from 'react';
import { v4 as uuid } from 'uuid';
import { match } from 'ts-pattern';
import { useDebouncedCallback } from 'use-debounce';
import { GetStateResponse, IDeskproClient, TargetAction, useDeskproAppClient, useDeskproAppEvents, useDeskproLatestAppContext, useInitialisedDeskproAppClient } from '@deskpro/app-sdk';
import { getNoteValues } from '../components/NoteForm';
import { queryClient } from '../query';
import { createNoteService, getContactService, setEntityAssocService } from '../services/hubspot';
import { getEntityContactList } from '../services/entityAssociation';
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

  const replyBoxAdditions = (action: TargetAction, type: ReplyBox) => {
    const key = type === 'note' ? noteKey : emailKey;
    const registerReplyBoxAdditionsTargetAction = type === 'email' ? registerReplyBoxEmailsAdditionsTargetAction : registerReplyBoxNotesAdditionsTargetAction;

    // eslint-disable-next-line @typescript-eslint/no-unsafe-call, @typescript-eslint/no-unsafe-member-access
    action.payload.forEach((selection: Selection) => {
      void client?.setState(key(selection.id), { id: selection.id, selected: selection.selected })
        .then(result => {
          if (result.isSuccess) {
            void registerReplyBoxAdditionsTargetAction(client, selection.id);
          };
        });
    });
  };

  const onReplyBox = async (action: TargetAction, type: ReplyBox) => {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-member-access
    const userID = action.context.data.user.id as string | undefined;

    if (!client || !userID) return;

    const linkedContactIDs = await getEntityContactList(client, userID);
    const contactID: Contact['id'] = linkedContactIDs?.[0];

    if (!contactID) return;

    await client.setBlocking(true);
    
    try {
      const key = type === 'note' ? noteKey : emailKey;
      const selections = await client.getState<Selection>(key(contactID));
      const contactIDs = selections
        .filter(({ data }) => data?.selected)
        .map(({ data }) => data?.id);

      if (!contactIDs.length) return;

      const payload = action.payload[type];
      const note = type === 'email' ? `Email Sent from Deskpro: ${payload}` : `Note Made in Deskpro: ${payload}`;
      const noteData = getNoteValues({
        note,
        files: []
      }, []);
      const response = await createNoteService(client, noteData, uuid());

      await Promise.all(
        contactIDs.map(ID => setEntityAssocService(client, 'notes', response.id, 'contact', ID as string, 'note_to_contact'))
      );
      await queryClient.invalidateQueries();
    } finally {
      await client.setBlocking(false);
    };
  };

  const handleTargetAction = useCallback((action: TargetAction) => {
    void match(action.name)
      .with('hubspotReplyBoxNoteAdditions', () => {replyBoxAdditions(action, 'note')})
      .with('hubspotOnReplyBoxNote', async () => {onReplyBox(action, 'note')})
      .with('hubspotReplyBoxEmailAdditions', () => {replyBoxAdditions(action, 'email')})
      .with('hubspotOnReplyBoxEmail', async () => {onReplyBox(action, 'email')})
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