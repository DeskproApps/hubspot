import React from "react";
import PropTypes from "prop-types";

import {
  Panel,
  List,
} from "@deskpro/apps-components";

import {
  nullF,
} from "../util";

/**
 * XList
 *  Builds a list from an iterable after mapping a callback function on it
 * @param {{iter: Iterable, callback: function}}
 * XList calls `array.map(callback)`. See below the documentation of `callback`.
 */
const XList = ({
  iter,
  callback,
  Outer = Panel,
  renderHead = nullF,
}) => {
  return <Outer>
    {renderHead()}
    <List>{[...iter].map(callback).map((props) => {
      const {
        key,
        pannelProps = {},
        children = null,
        topRight = nullF,
        bottomRight = nullF,
      } = props;
      return <Panel
        key={key}
        {...pannelProps}
      >
        <div className="topRight"><div>{topRight()}</div></div>
        {children}
        <div className="bottomRight"><div>{bottomRight()}</div></div>
      </Panel>;
    })}
    </List>
  </Outer>;
};

/**
 * @callback callback
 * @param value from the array
 * @param index - the corresponding index
 * @param array - the full array
 * @returns {key, pannelProps?, children?, topRight?, bottomRight?}
 * @var {} props [mandatory] - can be empty - the props that XList will pass to
 *  the element
 * @var {} children the children that XList will pass to the element
 */

XList.propTypes = {
  iter: PropTypes.arrayOf(PropTypes.any).isRequired,
  callback: PropTypes.func.isRequired,
  Outer: PropTypes.node,
  renderHead: PropTypes.func,
};

export { XList };
