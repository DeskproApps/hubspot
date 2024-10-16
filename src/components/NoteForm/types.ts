import { AttachmentFile } from "../common/Attach";

export type Values = {
    note: string,
    files: AttachmentFile[],
};

export type Props = {
    onSubmit: (values: Values) => Promise<void>,
    onCancel: () => void,
};
