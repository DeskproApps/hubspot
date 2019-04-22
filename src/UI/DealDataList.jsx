import React from 'react';

import {
  DataList,
} from '@deskpro/apps-components';

const DealDataList = ({ getter }) => {
  return <DataList data={[
      ["Pipeline", getter("pipeline")],
      ["Stage", getter("dealstage")],
      ["Amount", getter("amount")],
    ].map(([label, value]) => ({ label, value }))
    }></DataList>;
}

export { DealDataList };
