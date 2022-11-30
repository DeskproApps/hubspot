import { IDeskproClient } from "@deskpro/app-sdk";
import { baseRequest } from "./baseRequest";
import { PROPERTIES } from "./constants";
import type { Note } from "./types";

const getNoteService = (client: IDeskproClient, noteId: Note["id"]) => {
    return baseRequest<Note>(client, {
        url: `/crm/v3/objects/notes/${noteId}`,
        entity: "note",
        queryParams: {
            properties: PROPERTIES.notes.join(",")
        }
    });
};

export { getNoteService };
