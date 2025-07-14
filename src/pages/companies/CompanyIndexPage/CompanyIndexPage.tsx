import { LoadingSpinner, useDeskproLatestAppContext } from '@deskpro/app-sdk';
import { ContextData, Data, DeskproOrganisation, Settings } from '../../../types';
import { useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';

function CompanyIndexPage() {
    const { context } = useDeskproLatestAppContext<ContextData, Settings>();
    const navigate = useNavigate();
    const [organisation, setOrganisation] = useState<DeskproOrganisation>();

    useEffect(() => {
        setOrganisation(context?.data?.organisation);
    }, [context?.data?.organisation]);

    if (organisation) {
        navigate('/companies/link');
    };

    return <LoadingSpinner />;
};

export default CompanyIndexPage;