import { IDeskproClient } from "@deskpro/app-sdk";
import { baseRequest } from "./baseRequest";
import type { Note } from "./types";

const createNoteService = (
    client: IDeskproClient,
    data: Record<string, string>,
) => {
    return baseRequest<Note>(client, {
        url: "/crm/v3/objects/notes",
        method: "POST",
        data: {
            properties: data,
        }
    });
};

export { createNoteService };
