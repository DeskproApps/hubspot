import { LoadingSpinner, useDeskproLatestAppContext, useInitialisedDeskproAppClient } from '@deskpro/app-sdk';
import { ContextData, DeskproOrganisation, Settings } from '../../../types';
import { useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { ErrorBlock } from '../../../components/common';
import { getEntityCompanyList } from '../../../services/entityAssociation';

function CompanyIndexPage() {
    const { context } = useDeskproLatestAppContext<ContextData, Settings>();
    const navigate = useNavigate();
    const [organisation, setOrganisation] = useState<DeskproOrganisation>();
    const [error, setError] = useState('');

    useEffect(() => {
        setOrganisation(context?.data?.organisation);
    }, [context?.data?.organisation]);

    // eslint-disable-next-line @typescript-eslint/no-misused-promises
    useInitialisedDeskproAppClient(async client => {
        if (!organisation) {
            return;
        };

        try {
            const linkedCompanies = await getEntityCompanyList(client, organisation.id);

            if (linkedCompanies.length > 0) {
                navigate(`/companies/${linkedCompanies[0]}`)
            };
        } catch (error) {
            setError(error instanceof Error ? error.message : 'error loading company index');
        };
    }, [organisation]);

    if (organisation) {
        navigate('/companies/link');
    };

    if (error) {
        return <ErrorBlock texts={[error]} />
    };

    return <LoadingSpinner />;
};

export default CompanyIndexPage;