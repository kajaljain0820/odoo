/**
 * AppError — structured application error thrown from services and repositories.
 * The central error handler converts these into the §6.3 JSON envelope.
 */
export class AppError extends Error {
  /**
   * @param {string} code    - Machine-readable error code (e.g. 'VALIDATION_ERROR')
   * @param {string} message - Human-readable summary
   * @param {number} status  - HTTP status code
   * @param {Array}  [details] - Field-level validation details
   */
  constructor(code, message, status = 500, details = []) {
    super(message);
    this.name = 'AppError';
    this.code = code;
    this.status = status;
    this.details = details;
  }
}
