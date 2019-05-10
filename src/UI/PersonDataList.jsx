import React from "react";
import PropTypes from "prop-types";

import {
  DataList,
} from "@deskpro/apps-components";

const PersonDataList = ({ getter }) => {
  return (
    <DataList data={[
      ["Email", getter("email")],
      ["Phone", getter("phone")],
      ["Job Title", getter("jobtitle")],
      ["Lifecycle stage", getter("lifecyclestage")],
    ].map(([label, value]) => ({ label, value }))
    } />);
};

PersonDataList.propTypes = {
  getter: PropTypes.func.isRequired,
};

export { PersonDataList };
