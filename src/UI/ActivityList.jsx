import React from "react";
import PropTypes from "prop-types";

import { XList } from "../component";

const ActivityList = ({ activityFilteredA }) => (
  <XList
    iter={activityFilteredA}
    callback={(value) => {
      return {
        key: value.engagement.id,
        pannelProps: { title: value.engagement.type },
        children: value.engagement.bodyPreview,
      };
    }}
  />);

ActivityList.propTypes = {
  activityFilteredA: PropTypes.arrayOf(PropTypes.shape({
    engagement: PropTypes.shape({
      id: PropTypes.any,
      type: PropTypes.any,
      bodyPreview: PropTypes.any,
    }),
  })).isRequired,
};

export { ActivityList };
