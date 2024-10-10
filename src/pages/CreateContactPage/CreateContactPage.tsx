import { FC, useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import {
    Context,
    LoadingSpinner,
    useDeskproElements,
    useDeskproAppClient,
    useDeskproLatestAppContext,
} from "@deskpro/app-sdk";
import { useLinkContact, useLinkUnlinkNote } from "../../hooks";
import { setEntityContact } from "../../services/entityAssociation";
import { createContactService } from "../../services/hubspot";
import { isValidationError, isConflictError } from "../../services/hubspot/utils";
import { getEntityMetadata } from "../../utils";
import { useContactMeta } from "./hooks";
import { CreateContact } from "../../components";
import type { ContextData } from "../../types";

const CreateContactPage: FC = () => {
    const navigate = useNavigate();
    const { client } = useDeskproAppClient();
    const { context } = useDeskproLatestAppContext() as { context: Context<ContextData> };
    const { linkContactFn } = useLinkUnlinkNote();
    const { getContactInfo } = useLinkContact();
    const [errors, setErrors] = useState<string[]>([]);
    const { structure, contactMetaMap, isLoading } = useContactMeta();

    const dpUser = context?.data?.user;

    useDeskproElements(({ deRegisterElement }) => {
        deRegisterElement("home");
        deRegisterElement("menu");
        deRegisterElement("edit");
        deRegisterElement("externalLink");
    });

    const onSubmit = useCallback((values: Record<string, string>) => {
        if (!client || !dpUser?.id) {
            return;
        }

        setErrors([]);

        return createContactService(client, values)
            .then(({ id }) => Promise.all([
                getContactInfo(id).then((data) => setEntityContact(client, dpUser.id, id, getEntityMetadata(data))),
                linkContactFn(id),
            ]))
            .then(() => navigate("/home"))
            .catch((err) => {
                if (isValidationError(err)) {
                    setErrors([err.message]);
                } else if (isConflictError(err)) {
                    setErrors((state) => ([...state, err.message ]));
                } else {
                    throw err;
                }
            })
    }, [client, dpUser?.id, getContactInfo, linkContactFn, navigate]);

    const onNavigateToLink = useCallback(() => navigate("/link"), [navigate]);

    if (isLoading) {
        return (
            <LoadingSpinner/>
        );
    }

    return (
        <CreateContact
            errors={errors}
            onSubmit={onSubmit}
            onNavigateToLink={onNavigateToLink}
            config={{ structure, metaMap: contactMetaMap }}
            values={{
                email: dpUser?.primaryEmail || "",
                firstname: dpUser?.firstName || "",
                lastname: dpUser?.lastName || "",
            }}
        />
    );
};

export { CreateContactPage };
