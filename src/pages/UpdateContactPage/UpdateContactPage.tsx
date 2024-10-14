import { useState, useCallback } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
    LoadingSpinner,
    useDeskproElements,
    useDeskproAppClient,
    useDeskproLatestAppContext,
} from "@deskpro/app-sdk";
import { queryClient, QueryKey } from "../../query";
import { setEntityContact } from "../../services/entityAssociation";
import { isConflictError, isValidationError } from "../../services/hubspot/utils";
import { useContact, useLinkContact } from "../../hooks";
import { getEntityMetadata } from "../../utils";
import { UpdateContact } from "../../components";
import { updateContactService } from "../../services/hubspot";
import type { FC } from "react";
import type { FormValues } from "../../components/common/Builder";

const UpdateContactPage: FC = () => {
    const navigate = useNavigate();
    const { contactId } = useParams();
    const { client } = useDeskproAppClient();
    const { context } = useDeskproLatestAppContext();
    const [errors, setErrors] = useState<string[]>([]);
    const { getContactInfo } = useLinkContact();
    const { structure, contact, contactMetaMap, isLoading } = useContact(contactId);
    const dpUserId = context?.data?.user?.id;

    const onSubmit = useCallback((values: FormValues) => {
        if (!client || !contactId || !dpUserId) {
            return;
        }

        setErrors([]);

        return updateContactService(client, contactId, values)
            .then(() => getContactInfo(contactId))
            .then((data) => {
                return setEntityContact(client, dpUserId, contactId, getEntityMetadata(data));
            })
            .then(() => queryClient.refetchQueries([QueryKey.CONTACT, contactId]))
            .then(() => navigate(`/contacts/${contactId}`))
            .catch((err) => {
                if (isValidationError(err)) {
                    setErrors((state) => [...state, err.message]);
                } else if (isConflictError(err)) {
                    setErrors((state) => [...state, err.message]);
                } else {
                    throw err;
                }
            });
    }, [client, contactId, dpUserId, getContactInfo, navigate]);

    const onCancel = useCallback(() => navigate(`/contacts/${contactId}`), [navigate, contactId]);

    useDeskproElements(({ deRegisterElement, registerElement }) => {
        deRegisterElement("home");
        deRegisterElement("menu");
        deRegisterElement("edit");
        deRegisterElement("externalLink");

        registerElement("home", {
            type: "home_button",
            payload: { type: "changePage", path: `/home` },
        });
    });

    if (isLoading || !contact) {
        return (
            <LoadingSpinner/>
        );
    }

    return (
        <UpdateContact
            errors={errors}
            onSubmit={onSubmit}
            onCancel={onCancel}
            config={{ structure, metaMap: contactMetaMap }}
            values={contact as FormValues}
        />
    );
};

export { UpdateContactPage };
