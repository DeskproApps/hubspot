import { IDeskproClient } from "@deskpro/app-sdk";
import { baseRequest } from "./baseRequest";
import type { Note } from "./types";

const properties = ["hs_object_id", "hubspot_owner_id", "hs_note_body", "hs_lastmodifieddate"];

const getNoteService = (client: IDeskproClient, noteId: Note["id"]) => {
    return baseRequest<Note>(client, {
        url: `/crm/v3/objects/notes/${noteId}`,
        entity: "note",
        queryParams: {
            properties: properties.join(",")
        }
    });
};

export { getNoteService };
