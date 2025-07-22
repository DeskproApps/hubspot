/**
 * gets the value at `path` of `object`. If the resolved value is `undefined`, the `defaultValue` is returned in its place
 * mimics LoDash's `_.get` behavior for string or array paths and optional default values
 *
 * @template TObject type of the object
 * @template TValue expected type of the value at the path
 * @param {TObject | null | undefined} obj object to query
 * @param {string | string[]} path path of the property to get
 * @param {TValue} [defaultValue] value returned if the resolved value is `undefined`
 * @returns {TValue | undefined} returns the resolved value
 */
export function get<TObject extends object, TValue = unknown>(
  obj: TObject | null | undefined,
  path: string | string[],
  defaultValue?: TValue
): TValue | undefined {
  if (obj === null || typeof obj === 'undefined') {
    return defaultValue;
  };

  const pathParts = Array.isArray(path) ? path : path.split('.');
  let current: any = obj;

  for (let i = 0; i < pathParts.length; i++) {
    const part = pathParts[i];

    if (current === null || typeof current === 'undefined' || !Object.prototype.hasOwnProperty.call(current, part)) {
      return defaultValue;
    };

    current = current[part];
  };

  return current === undefined ? defaultValue : current;
};