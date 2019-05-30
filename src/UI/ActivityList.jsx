import React from "react";
import PropTypes from "prop-types";

import { XList } from "../component";

const ActivityList = ({ activity_filtered_a }) => (
  <XList
    iter={activity_filtered_a}
    callback={(value) => {
      return {
        key: value.engagement.id,
        pannelProps: { title: value.engagement.type },
        children: value.engagement.bodyPreview,
      };
    }}
  />);

ActivityList.propTypes = {
  activity_filtered_a: PropTypes.arrayOf(PropTypes.shape({
    engagement: PropTypes.shape({
      id: PropTypes.any,
      type: PropTypes.any,
      bodyPreview: PropTypes.any,
    }),
  })).isRequired,
};

export { ActivityList };
