/**
 *
 * @param {Object} object
 * @param {string} dotted_name
 * @param {*} alternative replacement value
 */
function access(object, dotted_name, alternative) {
  let name_list;
  if(!dotted_name) {
    name_list = [];
  } else {
    name_list = dotted_name.split(".");
  }
  let value = object;
  for (let key of name_list) {
    if (value) {
      value = value[key];
    } else {
      return alternative;
    }
  }
  if (value === undefined || value === null) {
    return alternative;
  }
  return value;
}

function test_access() { // eslint-disable-line no-unused-vars
  let o = {a:{b:{c:"ok"}}};
  console.assert(access(o, "a.b.c", "nope") === "ok");
  console.assert(access(o, "a.b.d", "nope") === "nope");
  console.assert(access(o, "a.a", "nope") === "nope");
  console.assert(access(o, "d", "nope") === "nope");
  console.assert(access(o.a.b, "c", "nope") === "ok");
  console.assert(access("ok", "", "nope") === "ok");
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

export { access, wtf };
