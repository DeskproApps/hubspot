import { isIterable } from "./checking";

/**
 * parseDottedName
 *
 * Splits the given string on dot. If a key begins with a digit, convert
 * it to number
 * @param {string} dottedName
 * @returns {Array<string|number}
 */
function parseDottedName(dottedName) {
  return dottedName
    .split(".")
    .map((key) => (key.match(/^[0-9]/) ? Number(key) : key));
}

/**
 * obtain
 *
 * @param {Object} object
 * @param {string} dottedName
 * @param {*} successF callback function in case of success
 * -- will be passed the obtained value as single argument
 * @param {*} failureF callback function in case of failure
 * -- is documented far below
 * @returns {*} the return value of successF in case of success. That
 * of failureF otherwise
 */
function obtain(object, dottedName, successF, failureF) {
  const keyA = dottedName ? parseDottedName(dottedName) : [];
  let value = object;
  for (const key of keyA) {
    if (value) {
      value = value[key];
    } else {
      break;
    }
  }
  if (value === undefined || value === null) {
    return failureF({
      key: dottedName,
      obj: object,
      val: value,
      from: "obtain",
    });
  }
  return successF(value);
}

/**
 * access
 *
 * @param {Object} object
 * @param {string} dottedName
 * @param {*} alternative replacement value
 */
function access(object, dottedName, alternative) {
  return obtain(object, dottedName, (x) => x, () => alternative);
}

/**
 * seeThrough
 *
 * @param {string|Array<any>} dottedName the dot-separated property path or an
 * array of properties
 * @param {Object} object
 * @returns {Object} an object gathering all values found at the different depth
 * in `object`
 */
function seeThrough(dottedName) {
  let nameA;
  if (typeof dottedName === "string") {
    nameA = parseDottedName(dottedName);
  } else if (isIterable(dottedName)) {
    nameA = dottedName;
  } else {
    throw new Error(`seeThrough: bad argument \`dottedName\`: ${dottedName}`);
  }
  const [name, ...keyA] = nameA;
  return (object) => {
    const info = { [name]: object };
    let progressiveName = name;
    let obj = object;
    for (const key of keyA) {
      progressiveName += `.${key}`;
      obj = obj[key];
      info[progressiveName] = obj;
      if (!obj) {
        break;
      }
    }
    return info;
  };
}

/**
 * what
 *
 * Allows you to inspect a "thing" with a custom function: infoExtractor
 * @param {string|any -> object} infoExtractor
 * * if infoExtractor is a function, it will be passed the
 * should return an object with one or a small number of entries.
 * key-values will be logged to console one by one
 * * if infoExtractor is a string, it is split on dot. The leftmost
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
  let infoExtractor;
  if (typeof arg === "function") {
    infoExtractor = arg;
  } else if (typeof arg === "string" || isIterable(arg)) {
    infoExtractor = seeThrough(arg);
  } else {
    console.warn("what: unexpected type for infoExtractor", infoExtractor);
    return (thing) => thing;
  }
  return (thing) => {
    const logme = infoExtractor(thing);
    if (typeof logme === "object") {
      console.group();
      Object.entries(logme).forEach(([key, val]) => {
        console.log(`what: ${key}:`, val);
      });
      console.groupEnd();
    } else {
      const msg =
        logme === undefined ? "returned undefined" : "didn't return an object";
      console.warn(`what: infoExtractor ${msg} -- no info`);
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
 * @param {(val, key, obj) -> any} failF callback documented below
 */
const take = (obj, key) => (failureF) => {
  if (obj[key] !== null && obj[key] !== undefined) {
    return obj[key];
  }
  return failureF({
    key,
    obj,
    val: obj[key],
    from: "take",
  });
};
/**
 * @callback failureF
 * @param {key: string, obj: object, val: null|undefined, from: string}
 * @param key the key whose access failed
 * @param obj the given object
 * @param val the failing result value -- null or undefined
 * @param from the name of the util function calling failureF
 * @returns {any} the substitution value
 */

export { access, obtain, seeThrough, what, take };
