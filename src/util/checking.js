/**
 * isIterable
 *
 * @param {any} object
 * @returns true if the object is iterable, false otherwise
 */
function isIterable(object) {
  return object && object[Symbol.iterator] === "function";
}

export { isIterable };
