import { ExternalIconLink, LoadingSpinner } from '@deskpro/app-sdk';
import { Company } from '../../../services/hubspot/types';
import { Checkbox, P3, Stack } from '@deskpro/deskpro-ui';
import { HubSpotLogo } from '../../../components/common';
import { Dispatch, SetStateAction } from 'react';

interface CompaniesList {
    companies: Company[];
    selectedCompanyID: string;
    setSelectedCompanyID: Dispatch<SetStateAction<string>>;
    isLoading: boolean;
    portalID: number;
};

function CompaniesList({
    companies,
    selectedCompanyID,
    setSelectedCompanyID,
    isLoading,
    portalID
}: CompaniesList) {
    if (isLoading) {
        return (
            <Stack align='center' justify='center' style={{ width: '100%' }}>
                <LoadingSpinner />
            </Stack>
        );
    };

    return (
        <Stack vertical padding={12} style={{ width: '100%' }}>
            {companies.map(company => {
                const isSelectedCompany = company.id === selectedCompanyID;

                return (
                    <Stack gap={6} justify='space-between' style={{ width: '100%' }}>
                        <Stack align='center' gap={6} style={{ minWidth: 0 }}>
                            <Checkbox
                                checked={isSelectedCompany}
                                onClick={() => {
                                    if (!isSelectedCompany) {
                                        setSelectedCompanyID(company.id);

                                        return;
                                    };

                                    setSelectedCompanyID('');
                                }}
                            />
                            <P3
                                title={company.properties.name}
                                style={{
                                    whiteSpace: 'nowrap',
                                    overflow: 'hidden',
                                    textOverflow: 'ellipsis',
                                    flexShrink: 1,
                                    minWidth: 0
                                }}
                            >
                                {company.properties.name}
                            </P3>
                        </Stack>
                        <div>
                            <ExternalIconLink
                                icon={<HubSpotLogo />}
                                href={`https://app.hubspot.com/contacts/${portalID}/record/0-2/${company.id}`}
                            />
                        </div>
                    </Stack>
                );
            })}
        </Stack>
    );
};

export default CompaniesList;