import { HorizontalDivider, Search, useDeskproAppClient, useDeskproLatestAppContext, useInitialisedDeskproAppClient } from '@deskpro/app-sdk';
import { Button, Stack } from '@deskpro/deskpro-ui';
import { useState } from 'react';
import { useDebounce } from 'use-debounce';
import { getAccountInfoService, getCompaniesService } from '../../../services/hubspot';
import { ErrorBlock } from '../../../components/common';
import { Company } from '../../../services/hubspot/types';
import CompaniesList from './CompaniesList';
import { setEntityCompany } from '../../../services/entityAssociation';
import { ContextData } from '../../../types';
import { useNavigate } from 'react-router-dom';

function LinkCompanyPage() {
    const [isLoading, setIsLoading] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const [debouncedSearchQuery] = useDebounce(searchQuery, 1000);
    const [error, setError] = useState('');
    const [companies, setCompanies] = useState<Company[]>();
    const [selectedCompanyID, setSelectedCompanyID] = useState('');
    const [portalID, setPortalID] = useState(0);
    const { client } = useDeskproAppClient();
    const { context } = useDeskproLatestAppContext<ContextData, unknown>();
    const organisation = context?.data?.organisation;
    const navigate = useNavigate();

    useInitialisedDeskproAppClient(client => {
        client.setTitle('Link Company');
    }, []);

    useInitialisedDeskproAppClient(async client => {
        try {
            setIsLoading(true);

            const accountInfo = await getAccountInfoService(client);
            setPortalID(accountInfo.portalId);
        } catch (error) {
            setError(error instanceof Error ? error.message : 'error fetching account info');
        } finally {
            setIsLoading(false);
        };
    }, []);

    useInitialisedDeskproAppClient(async client => {
        try {
            setIsLoading(true);

            const companies = await getCompaniesService(client);
            const filteredCompanies = companies.results.filter(company => company.properties.name.toLowerCase().includes(debouncedSearchQuery.toLowerCase()));

            setCompanies(filteredCompanies);
        } catch (error) {
            setError(error instanceof Error ? error.message : 'error fetching companies');
        } finally {
            setIsLoading(false);
        };
    }, [debouncedSearchQuery]);

    const linkCompany = async (companyID: Company['id']) => {
        if (!client || !organisation) {
            return;
        };

        try {
            setIsLoading(true);

            await setEntityCompany(client, organisation.id, companyID);

            navigate(`/companies/${companyID}`);
        } catch (error) {
            setError(error instanceof Error ? error.message : 'error linking company');
        } finally {
            setIsLoading(false);
        };
    };

    if (error) {
        return <ErrorBlock texts={[error]} />
    };

    return (
        <Stack style={{ width: '100%' }} vertical>
            <Stack gap={6} padding={12} style={{ width: '100%' }} vertical>
                <div style={{ width: '100%' }}>
                    <Search
                        isFetching={isLoading}
                        marginBottom={0}
                        onChange={query => { setSearchQuery(query) }}
                        inputProps={{
                            placeholder: 'Enter Company Name',
                            value: searchQuery
                        }}
                    />
                </div>
                <Button
                    text='Link Company'
                    disabled={isLoading || !selectedCompanyID}
                    onClick={() => linkCompany(selectedCompanyID)}
                />
                <HorizontalDivider style={{ margin: 0, width: '100%' }} />
                {companies && companies.length > 0 ? (
                    <CompaniesList
                        companies={companies}
                        selectedCompanyID={selectedCompanyID}
                        setSelectedCompanyID={setSelectedCompanyID}
                        isLoading={isLoading}
                        portalID={portalID}
                    />
                ) : (
                    <Stack padding={12} style={{ width: '100%' }}>
                        <em style={{
                            whiteSpace: 'normal',
                            wordBreak: 'break-word',
                            fontSize: '12px'
                        }}>
                            No Company Found Matching the Provided Query
                        </em>
                    </Stack>
                )}
            </Stack>
        </Stack>
    );
};

export default LinkCompanyPage;