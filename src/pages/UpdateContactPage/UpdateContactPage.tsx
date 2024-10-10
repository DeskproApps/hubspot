import { FC, useState, useCallback } from "react";
import get from "lodash/get";
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
import { useContactMeta, useLinkContact } from "../../hooks";
import { getEntityMetadata } from "../../utils";
import { ContactForm } from "../../components";
import { BaseContainer, ErrorBlock } from "../../components/common";
import { getContactValues } from "../../components/ContactForm/utils";
import { updateContactService } from "../../services/hubspot";
import type { Values, FormErrors } from "../../components/ContactForm/types";

const UpdateContactPage: FC = () => {
    const navigate = useNavigate();
    const { contactId } = useParams();
    const { client } = useDeskproAppClient();
    const { context } = useDeskproLatestAppContext();
    const { getContactInfo } = useLinkContact();
    const [errors, setErrors] = useState<string[]>([]);
    const { structure, contactMetaMap, isLoading } = useContactMeta();

    const dpUserId = context?.data?.user?.id;

    const onSubmit = useCallback((values: Record<string, unknown>) => {
        if (!client || !contactId || !dpUserId) {
            return;
        }

        const data = getContactValues(values);

        setErrors([]);

        return updateContactService(client, contactId, data)
            .then(() => getContactInfo(contactId))
            .then((data) => {
                return setEntityContact(client, dpUserId, contactId, getEntityMetadata(data));
            })
            .then(() => queryClient.refetchQueries([QueryKey.CONTACT, contactId]))
            .then(() => navigate("/home"))
            .catch((err) => {
                if (isValidationError(err)) {
                    setErrors((state) => [...state, err.message]);
                } else if (isConflictError(err)) {
                    setErrors((state) => [...state, err.message]);
                } else {
                    throw new Error(err);
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

    return (
        <BaseContainer>
            {isLoading
                ? <LoadingSpinner/>
                : (
                    <>
                        {errors && <ErrorBlock texts={[errors]}/>}
                        <ContactForm
                            initValues={{
                                email: contact?.email || "",
                                firstName: contact?.firstname || "",
                                lastName: contact?.lastname || "",
                                jobTitle: contact?.jobtitle || "",
                                phone: contact?.phone || "",
                                ownerId: contact?.hubspot_owner_id || "",
                                lifecycleStage: contact?.lifecyclestage || "",
                            }}
                            formErrors={formErrors}
                            isEditMode
                            onSubmit={onSubmit}
                            onCancel={onCancel}
                            owners={owners}
                            lifecycleStages={lifecycleStages}
                            leadStatuses={leadStatuses}
                        />
                    </>
                )
            }
        </BaseContainer>
    );
};

export { UpdateContactPage };
