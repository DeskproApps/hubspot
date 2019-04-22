
/**
 * obtain
 *
 * @param {Object} object
 * @param {string} dotted_name
 * @param {*} failure_f callback function in case of failure -- documented far
 * below
 */
function obtain(object, dotted_name, success_f, failure_f) {
  const key_a = (dotted_name ? dotted_name.split(".") : []).map(
    (key) => key.match(/^[1-9]\d*$/) ? Number(key) : key
  );
  let value = object;
  for (let key of key_a) {
    if (value) {
      value = value[key];
    } else {
      break;
    }
  }
  if (value === void 0 || value === null) {
    return failure_f("obtain", {key: dotted_name, obj: object, val: value});
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
 * wtf
 * Helps you inspect an object using a custom info_extractor
 * @param {any -> object} info_extractor should return an object with
 * one or a small number of entries.
 * key-values will be logged to console one by one
 *
 * Example
 * ```js
 * const t = [] || [10, 20];
 * wtf(x => ({length: x.length})).map(x => console.log(x));
 * ```
 */
function wtf(info_extractor) {
  if (typeof info_extractor !== "function") {
    if (typeof info_extractor === "string") {
      const key = info_extractor;
      info_extractor = ((x) => ({ [key]: x }));
    } else {
      console.warn(`wtf: unexpected type for info_extractor`, info_extractor);
      return (thing) => thing;
    }
  }
  return (thing) => {
    const logme = info_extractor(thing);
    if (typeof logme === "object") {
      Object.entries(logme).map(
        ([key, val]) => console.debug(`wtf: ${key}:`, val)
      );
    } else {
      const what =
        logme === void 0 ?
          "returned undefined" :
          "didn't return an object";
      console.warn(`wtf: info_extractor ${what} -- no info`);
    }
    return thing;
  }
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
    failure_f("take", { key, obj, val: obj[key], });

/**
 * @callback failure_f
 * @param name the name of the util function calling failure_f
 * @param {key: string, obj: object, val: null|undefined}
 * @param key the key whose access failed
 * @param obj the given object
 * @param val the failing result value -- null or undefined
 * @returns {any} the substitution value
 */


export { access, obtain, wtf, take, };
