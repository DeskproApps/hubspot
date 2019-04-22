import React from 'react';

import {
  DataList,
} from '@deskpro/apps-components';

const PersonDataList = ({ getter }) => {
  return <DataList data={[
      ["Email", getter("email")],
      ["Phone", getter("phone")],
      ["Job Title", getter("jobtitle")],
      ["Lifecycle stage", getter("lifecyclestage")],
    ].map(([label, value]) => ({ label, value }))
    }></DataList>;
}

export { PersonDataList };
