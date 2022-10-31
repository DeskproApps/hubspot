import { FC, useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { faSearch, faPlus } from "@fortawesome/free-solid-svg-icons";
import {
    Context,
    TwoButtonGroup,
    LoadingSpinner,
    useDeskproElements,
    useDeskproAppClient,
    useDeskproLatestAppContext,
} from "@deskpro/app-sdk";
import { useLoadUpdateContactDeps } from "../hooks";
import { setEntityContact } from "../services/entityAssociation";
import { createContactService } from "../services/hubspot";
import { isValidationError, isConflictError } from "../services/hubspot/utils";
import { BaseContainer, ErrorBlock } from "../components/common";
import { ContactForm } from "../components";
import { getContactValues } from "../components/ContactForm/utils";
import type { Values, FormErrors } from "../components/ContactForm/types";
import type { ContextData } from "../types";

const CreateContactPage: FC = () => {
    const navigate = useNavigate();
    const { client } = useDeskproAppClient();
    const { context } = useDeskproLatestAppContext();
    const {
        owners,
        isLoading,
        leadStatuses,
        lifecycleStages,
    } = useLoadUpdateContactDeps();

    const [error, setError] = useState<string|null>(null);
    const [formErrors, setFormErrors] = useState<FormErrors|null>(null);

    const deskproUserId = (context as Context<ContextData>)?.data?.user.id;
    const primaryEmail = (context as Context<ContextData>)?.data?.user.primaryEmail;
    
    useDeskproElements(({ deRegisterElement }) => {
        deRegisterElement("home");
        deRegisterElement("menu");
        deRegisterElement("edit");
        deRegisterElement("externalLink");
    });

    const onLinkContact = useCallback((contactId) => {
        if (!client || !deskproUserId || !contactId) {
            return;
        }

        setEntityContact(client, deskproUserId, contactId)
            // eslint-disable-next-line @typescript-eslint/ban-ts-comment
            // @ts-ignore
            .then((isSuccess: boolean) => {
                if (isSuccess) {
                    navigate("/home");
                }
            })
    }, [client, deskproUserId, navigate]);

    const onSubmit = async (values: Values) => {
        if (!client) {
            return;
        }

        setError(null);
        setFormErrors(null);
        const data = getContactValues(values);

        // ToDo: replace to useMutation from react-query
        return createContactService(client, data)
            .then(({ id }) => {
                return onLinkContact(id);
            })
            .catch((err) => {
                if (isValidationError(err)) {
                    setError(err.message);
                } else if (isConflictError(err)) {
                    setFormErrors((state) => ({ ...state, email: err.message }) as FormErrors);
                } else {
                    throw new Error(err);
                }
            })
    };

    const onCancel = () => {
        navigate("/home");
    };

    const onNavigateToLinkContact = useCallback(() => {
        navigate("/link");
    }, [navigate]);

    return (
        <BaseContainer>
            <TwoButtonGroup
                selected="two"
                oneLabel="Find contact"
                oneIcon={faSearch}
                oneOnClick={onNavigateToLinkContact}
                twoLabel="Create contact"
                twoIcon={faPlus}
                twoOnClick={() => {}}
            />
            {error && <ErrorBlock text={error}/>}
            {isLoading
                ? <LoadingSpinner />
                : <ContactForm
                    initValues={{ email: primaryEmail }}
                    onSubmit={onSubmit}
                    onCancel={onCancel}
                    formErrors={formErrors}
                    owners={owners}
                    lifecycleStages={lifecycleStages}
                    leadStatuses={leadStatuses}
                />
            }
        </BaseContainer>
    );
};

export { CreateContactPage };
