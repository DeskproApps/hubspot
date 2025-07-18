import { LoadingSpinner, useDeskproElements, useDeskproLatestAppContext, useInitialisedDeskproAppClient } from '@deskpro/app-sdk';
import { Stack } from '@deskpro/deskpro-ui';
import { useParams } from 'react-router-dom';
import { Settings } from '../../../types';
import { useState } from 'react';
import { Company } from '../../../services/hubspot/types';
import { getAccountInfoService, getCompanyService } from '../../../services/hubspot';
import { ErrorBlock, HubSpotLogo, TextBlockWithLabel } from '../../../components/common';
import Title from '../../../components/common/Title/Title';
import { format } from '../../../utils/date';

function ViewCompanyPage() {
  const { companyId } = useParams();
  const { context } = useDeskproLatestAppContext<unknown, Settings>();
  const isUsingOAuth = context?.settings.use_api_token === false || context?.settings.use_advanced_connect === false;
  const [company, setCompany] = useState<Company>();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [portalID, setPortalID] = useState(0);

  useInitialisedDeskproAppClient(client => {
    client.setTitle('View Company');
  }, []);

  useDeskproElements(({ clearElements, registerElement }) => {
    clearElements();
    registerElement('refresh', { type: 'refresh_button' });

    if (isUsingOAuth) {
      registerElement('menu', {
        type: 'menu',
        items: [
          {
            title: 'Unlink Company',
            payload: {
              type: 'unlink-company',
              companyID: companyId
            }
          },
          {
            title: 'Log Out',
            payload: { type: 'logout' }
          }
        ]
      });
    };
  }, [isUsingOAuth]);

  // eslint-disable-next-line @typescript-eslint/no-misused-promises
  useInitialisedDeskproAppClient(async client => {
    if (!companyId) {
      return;
    };

    try {
      setIsLoading(true);

      const accountInfo = await getAccountInfoService(client);

      setPortalID(accountInfo.portalId);
    } catch (error) {
      setError(error instanceof Error ? error.message : 'error fetching account info');
    } finally {
      setIsLoading(false);
    };

    try {
      setIsLoading(true);

      const company = await getCompanyService(client, companyId);

      setCompany(company);
    } catch (error) {
      setError(error instanceof Error ? error.message : 'error fetching company');
    } finally {
      setIsLoading(false);
    };
  }, [companyId]);

  if (isLoading) {
    return (
      <Stack align='center' justify='center' style={{ width: '100%' }}>
        <LoadingSpinner />
      </Stack>
    );
  };

  if (error) {
    return <ErrorBlock texts={[error]} />
  };

  if (!company) {
    return <ErrorBlock texts={[`company not found with companyID: ${companyId}`]} />;
  };

  return (
    <div style={{ minHeight: '2em', padding: '8px' }}>
      <Title
        title={company.properties.name}
        icon={<HubSpotLogo />}
        link={`https://app.hubspot.com/contacts/${portalID}/record/0-2/${company.id}`}
      />
      <TextBlockWithLabel
        label='ID'
        text={company.id}
      />
      <TextBlockWithLabel
        label='Name'
        text={company.properties.name}
      />
      <TextBlockWithLabel
        label='Domain'
        text={company.properties.domain}
      />
      <TextBlockWithLabel
        label='Created Date'
        text={format(company.properties.createdate)}
      />
      <TextBlockWithLabel
        label='Last Modified Date'
        text={format(company.properties.hs_lastmodifieddate)}
      />
    </div>
  );
};

export default ViewCompanyPage;