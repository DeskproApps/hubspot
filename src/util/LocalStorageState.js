/**
 *
 * LocalStorageState
 *
 * Statefull function
 * @param {} {
 * @param {string} key The key used for the localStorage
 * @param {*} defaultValue JSON-serializable
 * @param {*} component If provided, must contain a setState method. That method
 * will be called each time the .set() method is called
 * }
 * @returns {} object with the below methods {
 * @method get get the state
 * @method set set the state. The passed value must be JSON-serializable
 * }
 */
const LocalStorageState = ({ key, defaultValue = null, component = null }) => {
  const json = localStorage.getItem(key);
  let item;
  if (json) {
    item = JSON.parse(json);
  } else {
    item = defaultValue;
  }

  const get = () => item;
  const set = (value) => {
    localStorage.setItem(key, JSON.stringify(value));
    if (item !== value) if (component) component.setState({});
    item = value;
  };

  return { get, set };
};

export { LocalStorageState };
