import * as yup from "yup";
import { mdToHtml } from "../../utils";
import { parseDateTime } from "../../utils/date";
import type { AttachmentFile } from "../common/Attach";
import type { Values } from "./types";
import type { DateTime } from "../../types";
import type { UploadFile } from "../../services/hubspot/types";

const folderPath = "/deskpro/";

const validationSchema = yup.object().shape({
    note: yup.string().required(),
    files: yup.array().of(
        yup.object().shape({
            name: yup.string(),
            size: yup.number(),
        })
    ),
});

const getInitValues = (): Values => ({
    note: "",
    files: [],
});

const getFileData = ({ file }: AttachmentFile): FormData|void => {
    if (file) {
        const form = new FormData();
        form.append("file", file);
        form.append("folderPath", folderPath);
        form.append("options", JSON.stringify({ access: "PUBLIC_NOT_INDEXABLE", overwrite: false }));
        return form;
    } else {
        return undefined;
    }
};

const getNoteValues = (values: Values, files: UploadFile[]): {
    hs_note_body?: string,
    hs_timestamp?: DateTime,
    hs_attachment_ids?: string,
} => {
    const note = values.note === "" ? "" : values.note;
    const uploadFiles = files.map(({ id }) => id).filter((fileId) => Boolean(fileId)).join(";");

    return (!note && !uploadFiles)
        ? {}
        : {
            hs_timestamp: parseDateTime(new Date()) as string,
            ...(note === "" ? {} : { hs_note_body: mdToHtml(note) }),
            ...(uploadFiles === "" ? {} : { hs_attachment_ids: uploadFiles }),
        };
}

const isEmptyForm = (values: Values): boolean => {
    return values.note === "" && values.files.length === 0;
};

export {
    getFileData,
    isEmptyForm,
    getNoteValues,
    getInitValues,
    validationSchema,
};