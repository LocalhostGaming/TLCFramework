class LostTypeError extends Error {
  constructor(message) {
    super(message);

    this.name = '[type-error]';
    this.message = message;
  }
}

class LostDuplicateError extends Error {
  constructor(message) {
    super(message);

    this.name = '[duplicate-error]';
    this.message = message;
  }
}

class LostReferenceError extends Error {
  constructor(message) {
    super(message);

    this.name = '[reference-error]';
    this.message = message;
  }
}

class LostError extends Error {
  constructor(message) {
    super(message);

    this.name = '[lost-error]';
    this.message = message;
  }
}

export {
  LostError,
  LostTypeError,
  LostDuplicateError,
  LostReferenceError,
}
