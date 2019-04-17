
/**
 *
 * @param {Object} object
 * @param {string} dotted_name
 * @param {*} failure_f callback function in case of failure
 */
function obtain (object, dotted_name, success_f, failure_f) {
  let name_list;
  if(!dotted_name) {
    name_list = [];
  } else {
    name_list = dotted_name.split(".");
  }
  let value = object;
  for (let key of name_list) {
    if (value) {
      if (key.match(/[1-9]\d*/)) {
        key = Number(key);
      }
      value = value[key];
    } else {
      break;
    }
  }
  if (value === undefined || value === null) {
    return failure_f(object, dotted_name);
  }
  return success_f(value);

}

/**
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
      info_extractor = ((x) => ({[key]: x}));
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
        logme === undefined ?
        "return undefined" :
        "didn't return an object";
      console.warn(`wtf: info_extractor ${what} -- no info`);
    }
    return thing;
  }
}

export { access, obtain, wtf };
