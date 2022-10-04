import { IDeskproClient } from "@deskpro/app-sdk";
import { baseRequest } from "./baseRequest";
import type { Note } from "./types";

const getNoteService = async (client: IDeskproClient, noteId: Note["id"]) => {
    const properties = await baseRequest<string[]>(client, { url: "/crm/v3/objects/notes/properties" });
    return baseRequest<Note>(client, {
        url: `/crm/v3/objects/notes/${noteId}`,
        queryParams: {
            properties: properties.join(",")
        }
    });
};

export { getNoteService };
