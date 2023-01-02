// http://stackoverflow.com/a/35858868
const makeError = function (name) {
  const cls = class {
    constructor(message) {
      this.name = name;
      this.message = message;
      if (typeof Error.captureStackTrace === "function") {
        Error.captureStackTrace(this, this.constructor);
      } else {
        this.stack = new Error(message).stack;
      }
    }
  };
  cls.prototype = Object.create(Error.prototype);

  return cls;
};

export const InvalidSelectionCountError = makeError("InvalidSelectionCountError");
