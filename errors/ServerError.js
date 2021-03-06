class ServerError extends Error {
  constructor(message, ...rest) {
    super(...rest);
    this.status = 500;
    this.message = message;
  }
}

module.exports = ServerError;
