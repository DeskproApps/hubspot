import React from "react";
import PropTypes from "prop-types";

import { XList } from "../component";

const ActivityList = ({ activity_json_a }) => (
  <XList
    iter={activity_json_a}
    callback={(value) => [
      {
        key: value.engagement.id,
        title: value.engagement.type,
      },
      value.engagement.bodyPreview,
    ]}
  />);

ActivityList.prototype = {
  activity_json_a: PropTypes.arrayOf(PropTypes.shape({
    engagement: PropTypes.shape({
      id: PropTypes.any,
      type: PropTypes.any,
      bodyPreview: PropTypes.any,
    }),
  })),
};

export { ActivityList };
