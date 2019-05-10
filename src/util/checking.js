/**
 * is_iterable
 *
 * @param {any} object
 * @returns true if the object is iterable, false otherwise
 */
function is_iterable(object) {
  return object && object[Symbol.iterator] === "function";
}

export { is_iterable };
