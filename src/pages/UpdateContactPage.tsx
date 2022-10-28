import { FC, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
    LoadingSpinner,
    useDeskproElements,
    useDeskproAppClient,
} from "@deskpro/app-sdk";
import { queryClient, QueryKey } from "../query";
import { isConflictError, isValidationError } from "../services/hubspot/utils";
import { useLoadUpdateContactDeps } from "../hooks";
import { ContactForm } from "../components";
import { BaseContainer, ErrorBlock } from "../components/common";
import { getContactValues } from "../components/ContactForm/utils";
import { updateContactService } from "../services/hubspot";
import type { Values, FormErrors } from "../components/ContactForm/types";

const UpdateContactPage: FC = () => {
    const navigate = useNavigate();
    const { contactId } = useParams();
    const { client } = useDeskproAppClient();
    const {
        owners,
        contact,
        isLoading,
        leadStatuses,
        lifecycleStages,
    } = useLoadUpdateContactDeps(contactId);

    const [error, setError] = useState<string|null>(null);
    const [formErrors, setFormErrors] = useState<FormErrors|null>(null);

    const onSubmit = (values: Values) => {
        if (!client || !contactId) {
            return;
        }

        const data = getContactValues(values);

        setFormErrors(null);
        return updateContactService(client, contactId, data)
            .then(() => queryClient.refetchQueries([QueryKey.CONTACT, contactId]))
            .then(() => navigate("/home"))
            .catch((err) => {
                if (isValidationError(err)) {
                    setError(err.message);
                } else if (isConflictError(err)) {
                    setFormErrors((state) => ({ ...state, email: err.message }) as FormErrors);
                } else {
                    throw new Error(err);
                }
            });
    };

    const onCancel = () => navigate("/home");

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
                        {error && <ErrorBlock text={error}/>}
                        <ContactForm
                            initValues={{
                                email: contact.email,
                                firstName: contact.firstname,
                                lastName: contact.lastname,
                                jobTitle: contact.jobtitle,
                                phone: contact.phone,
                                ownerId: contact.hubspot_owner_id,
                                lifecycleStage: contact.lifecyclestage
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
