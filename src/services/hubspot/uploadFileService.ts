import { IDeskproClient } from "@deskpro/app-sdk";
import { baseRequest } from "./baseRequest";
import type { UploadFile } from "./types";

const uploadFileService = async (
    client: IDeskproClient,
    data: FormData,
) => {
    return baseRequest<UploadFile>(client, {
        url: "/files/v3/files",
        method: "POST",
        data,
    });
};

export { uploadFileService };
