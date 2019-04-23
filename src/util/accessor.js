import { is_iterable } from './checking';

/**
 * parse_dotted_name
 *
 * Splits the given string on dot. If a key begins with a digit, convert
 * it to number
 * @param {string} dotted_name
 * @returns {Array<string|number}
 */
function parse_dotted_name(dotted_name) {
  return dotted_name
    .split(".")
    .map((key) => key.match(/^[0-9]/) ? Number(key) : key);
}


/**
 * obtain
 *
 * @param {Object} object
 * @param {string} dotted_name
 * @param {*} success_f callback function in case of success
 * -- will be passed the obtained value as single argument
 * @param {*} failure_f callback function in case of failure
 * -- is documented far below
 * @returns {*} the return value of success_f in case of success. That
 * of failure_f otherwise
 */
function obtain(object, dotted_name, success_f, failure_f) {
  const key_a = (dotted_name ? parse_dotted_name(dotted_name) : []);
  let value = object;
  for (let key of key_a) {
    if (value) {
      value = value[key];
    }
    else {
      break;
    }
  }
  if (value === void 0 || value === null) {
    return failure_f("obtain", { key: dotted_name, obj: object, val: value });
  }
  return success_f(value);
}


/**
 * access
 *
 * @param {Object} object
 * @param {string} dotted_name
 * @param {*} alternative replacement value
 */
function access(object, dotted_name, alternative) {
  return obtain(object, dotted_name, (x) => x, (_o, _d) => alternative);
}


/**
 * see_through
 *
 * @param {string|Array<any>} dotted_name the dot-separated property path or an
 * array of properties
 * @param {Object} object
 * @returns {Object} an object gathering all values found at the different depth
 * in `object`
 */
function see_through(dotted_name) {
  let name_a;
  if (typeof dotted_name === "string") {
    name_a = parse_dotted_name(dotted_name);
  }
  else if (is_iterable(dotted_name)) {
    name_a = dotted_name;
  }
  else {
    throw new Error(`see_through: bad argument \`dotted_name\`: ${dotted_name}`);
  }
  const [name, ...key_a] = name_a;
  return (object) => {
    let info = { [name]: object };
    let progressive_name = name;
    for (let key of key_a) {
      progressive_name += "." + key;
      object = object[key];
      info[progressive_name] = object;
      if (!object)
        break;
    }
    return info;
  };
}


/**
 * what
 *
 * Allows you to inspect a "thing" with a custom function: info_extractor
 * @param {string|any -> object} info_extractor
 * * if info_extractor is a function, it will be passed the
 * should return an object with one or a small number of entries.
 * key-values will be logged to console one by one
 * * if info_extractor is a string, it is split on dot. The leftmost
 * part is used to name the what log entry, while the rest is used as an
 * access path into the inspected object.
 *
 * Example
 * ```js
 * const t = [] || [10, 20];
 * what(x => ({length: x.length}))(t).map(x => console.log(x));
 * ```
 */
function what(arg) {
  let info_extractor;
  if (typeof arg === "function") {
    info_extractor = arg;
  }
  else {
    if (typeof arg === "string" || is_iterable(arg)) {
      info_extractor = see_through(arg);
    }
    else {
      console.warn(`what: unexpected type for info_extractor`, info_extractor);
      return (thing) => thing;
    }
  }
  return (thing) => {
    const logme = info_extractor(thing);
    if (typeof logme === "object") {
      console.group();
      Object.entries(logme).map(([key, val]) => console.log(`what: ${key}:`, val));
      console.groupEnd();
    }
    else {
      const what = logme === void 0 ?
        "returned undefined" :
        "didn't return an object";
      console.warn(`what: info_extractor ${what} -- no info`);
    }
    return thing;
  };
}


/**
 * take
 * access a property of an object, handling undefined and null keys through a
 * callback failure fonction
 *
 * @param {object|any} obj
 * @param {string} key
 * @param {(val, key, obj) -> any} fail_f callback documented below
 */
const take = (obj, key) => (failure_f) =>
  (obj[key] !== null && obj[key] !== void 0) ?
  obj[key] :
  failure_f("take", {
    key,
    obj,
    val: obj[key],
  });

/**
 * @callback failure_f
 * @param name the name of the util function calling failure_f
 * @param {key: string, obj: object, val: null|undefined}
 * @param key the key whose access failed
 * @param obj the given object
 * @param val the failing result value -- null or undefined
 * @returns {any} the substitution value
 */

export {
  access,
  obtain,
  see_through,
  what,
  take,
};
