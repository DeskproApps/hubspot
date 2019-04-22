import React from 'react';
import { XList } from '../Component';

const ActivityList = ({ activity_json_a }) => {
  console.log({ activity_json_a });
return <XList
  iter={activity_json_a}
  callback={(value) => [
    {
      key: value.engagement.id,
      title: value.engagement.type,
    },
    value.engagement.bodyPreview
]}></XList>};

export { ActivityList };
