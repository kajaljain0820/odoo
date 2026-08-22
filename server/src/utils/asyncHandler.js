/**
 * asyncHandler.js — Wraps an async Express controller so that any
 * rejected promise is forwarded to next(err), hitting the central error handler.
 */
export const asyncHandler = (fn) => (req, res, next) => {
  Promise.resolve(fn(req, res, next)).catch(next);
};
