import React from 'react';
import { XList } from '../Component';

const ActivityList = ({ activity_json_a }) => <XList
  iter={activity_json_a}
  callback={(value) => [
    {
      key: value.engagement.id,
      title: value.engagement.type,
    },
    value.engagement.bodyPreview
]}></XList>;

export { ActivityList };
