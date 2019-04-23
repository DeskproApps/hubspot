class OxError extends Error {
  _info = {}

  constructor (message) {
    if (typeof message === "string") {
      super(message);
    } else {
      super();
    }
  }

  info (_info) {
    this._info = {
      ...this._info,
      ..._info
    }
    return this;
  }

  toString() {
    Object.keys(this._info).length && console.error(this._info);
    return super.toString();
  }
}

export { OxError };
