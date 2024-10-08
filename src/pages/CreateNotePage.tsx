import { useState, useCallback } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import isEmpty from "lodash/isEmpty";
import { useDeskproElements, useDeskproAppClient } from "@deskpro/app-sdk";
import { useSetAppTitle } from "../hooks";
import { createNoteService, setEntityAssocService, uploadFileService } from "../services/hubspot";
import { isValidationError } from "../services/hubspot/utils";
import { queryClient, QueryKey } from "../query";
import { NoteForm, getNoteValues, isEmptyForm, getFileData } from "../components/NoteForm";
import { BaseContainer, ErrorBlock } from "../components/common";
import type { FC } from "react";
import type { Values } from "../components/NoteForm/types";

const CreateNotePage: FC = () => {
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();
    const { client } = useDeskproAppClient();
    const contactId = searchParams.get("contactId") || undefined;

    const [error, setError] = useState<string|null>(null);

    useSetAppTitle("Add note");

    useDeskproElements(({ deRegisterElement, registerElement }) => {
        deRegisterElement("home");
        deRegisterElement("menu");
        deRegisterElement("externalLink");
        deRegisterElement("edit");

        registerElement("home", {
            type: "home_button",
            payload: { type: "changePage", path: `/home` },
        });
    });

    const onSubmit = async (values: Values) => {
        if (!client || !contactId || isEmptyForm(values)) {
            return;
        }

        setError(null);

        return Promise.all(
            values.files
                .map((file) => getFileData(file))
                .filter((file) => Boolean(file))
                .map((file) => uploadFileService(client, file as FormData))
        )
            .then((files) => {
                const data = getNoteValues(values, files);
                return (isEmpty(data))
                    ? Promise.reject("Empty form")
                    : createNoteService(client, data)
            })
            .then(({ id }) => setEntityAssocService(client, "notes", id, "contacts", contactId, "note_to_contact"))
            .then(() => queryClient.removeQueries({
                queryKey: [QueryKey.NOTES_BY_CONTACT_ID, contactId],
            }))
            .then(() => navigate("/home"))
            .catch((err) => {
                if (isValidationError(err)) {
                    setError(err.message);
                } else {
                    throw new Error(err);
                }
            })
    };

    const onCancel = useCallback(() => {
        navigate("/home");
    }, [navigate]);

    return (
        <BaseContainer>
            {error && <ErrorBlock texts={[error]}/>}
            <NoteForm onSubmit={onSubmit} onCancel={onCancel} />
        </BaseContainer>
    );
};

export { CreateNotePage };
