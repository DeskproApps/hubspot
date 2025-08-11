import { useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDeskproAppClient, useDeskproLatestAppContext } from '@deskpro/app-sdk';
import { deleteEntityCompany } from '../services/entityAssociation';
import { useAsyncError } from './useAsyncError';
import { Company } from '../services/hubspot/types';
import { ContextData, Settings } from '../types';

export function useUnlinkCompany() {
    const navigate = useNavigate();
    const { client } = useDeskproAppClient();
    const { context } = useDeskproLatestAppContext<ContextData, Settings>();
    const { asyncErrorHandler } = useAsyncError();
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const organisationID = context?.data?.organisation?.id

    const unlinkCompany = useCallback((companyID: Company['id']) => {
        if (!client || !organisationID || !companyID) {
            return;
        };

        setIsLoading(true);

        deleteEntityCompany(client, organisationID, companyID)
            .then(() => navigate('/companies/link'))
            .catch(asyncErrorHandler)
            .finally(() => setIsLoading(false));
    }, [client, organisationID, navigate, asyncErrorHandler]);

    return { unlinkCompany, isLoading };
};