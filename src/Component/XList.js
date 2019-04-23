import React from 'react';

import {
  Panel,
  List,
} from '@deskpro/apps-components';

import {
  take,
  null_f,
} from '../util';

/**
 * XList
 *  Builds a list from an iterable after mapping a callback function on it
 * @param {{iter: Iterable, callback: function}}
 * XList calls `array.map(callback)`. See below the documentation of `callback`.
 */
const XList = ({iter, callback, render_head = null_f}) =>
  <Panel>{render_head()}<List>{Array.prototype.map.call(iter, callback).map(
    ([props, ...children]) => {
      return <Panel {...props} key={take(props, "key")(console.error)}>{children}</Panel>
    }
  )}</List></Panel>;

/**
 * @callback callback
 * @param value from the array
 * @param index - the corresponding index
 * @param array - the full array
 * @returns {[props, ...children]}
 * @var {} props [mandatory] - can be empty - the props that XList will pass to the element
 * @var {} children the children that XList will pass to the element
 */

export { XList };
