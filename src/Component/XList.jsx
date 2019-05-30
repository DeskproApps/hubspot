import React from "react";
import PropTypes from "prop-types";

import {
  Panel,
  List,
} from "@deskpro/apps-components";

import {
  null_f,
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
  render_head = null_f,
}) => {
  return <Outer>
    {render_head()}
    <List>{[...iter].map(callback).map((props) => {
      const {
        key,
        pannelProps = {},
        children = null,
        top_right = null_f,
        bottom_right = null_f,
      } = props;
      return <Panel
        key={key}
        {...pannelProps}
      >
        <div className="topRight"><div>{top_right()}</div></div>
        {children}
        <div className="bottomRight"><div>{bottom_right()}</div></div>
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
 * @returns {key, pannelProps?, children?, top_right?, bottom_right?}
 * @var {} props [mandatory] - can be empty - the props that XList will pass to
 *  the element
 * @var {} children the children that XList will pass to the element
 */

XList.propTypes = {
  iter: PropTypes.arrayOf(PropTypes.any).isRequired,
  callback: PropTypes.func.isRequired,
  Outer: PropTypes.node,
  render_head: PropTypes.func,
};

export { XList };
