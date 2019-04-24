/**
 *
 * LocalStorageState
 *
 * Statefull function
 * @param {} {
 * @param {string} key The key used for the localStorage
 * @param {*} default_value JSON-serializable
 * @param {*} component If provided, must contain a setState method. That method
 * will be called each time the .set() method is called
 * }
 * @returns {} object with the below methods {
 * @method get get the state
 * @method set set the state. The passed value must be JSON-serializable
 * }
 */
const LocalStorageState = ({key, default_value = null, component = null}) => {

  const json = localStorage.getItem(key);
  let item;
  if (json) {
    item = JSON.parse(json);
  } else {
    item = default_value;
  }

  const get = () => item;
  const set = (value) => {
    localStorage.setItem(key, JSON.stringify(value));
    item = value;
    component && component.setState({});
  };

  return { get, set };
};

export { LocalStorageState };
