import { useDeskproElements, useDeskproLatestAppContext } from '@deskpro/app-sdk';
import { Stack } from '@deskpro/deskpro-ui';
import { useParams } from 'react-router-dom';
import { Settings } from '../../../types';

function ViewCompanyPage() {
  const { companyId } = useParams();
  const { context } = useDeskproLatestAppContext<unknown, Settings>();
  const isUsingOAuth = context?.settings.use_api_token === false || context?.settings.use_advanced_connect === false;

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

  return (
    <Stack>
      <h1>View Company Page</h1>
      <p>Company ID: {companyId}</p>
      {/* Additional components and logic for viewing a company can be added here */}
    </Stack>
  );
};

export default ViewCompanyPage;