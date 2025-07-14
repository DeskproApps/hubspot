import { Stack } from '@deskpro/deskpro-ui';
import { useParams } from 'react-router-dom';

function ViewCompanyPage() {
  const { companyId } = useParams();

  return (
    <Stack>
      <h1>View Company Page</h1>
      <p>Company ID: {companyId}</p>
      {/* Additional components and logic for viewing a company can be added here */}
    </Stack>
  );
};

export default ViewCompanyPage;