/**
 * errorHandler.js — Express central error handler.
 * Emits the §6.3 JSON envelope. Never sends a stack trace to the client.
 */
import { AppError } from './AppError.js';
import { env } from '../config/env.js';

// eslint-disable-next-line no-unused-vars
export function errorHandler(err, req, res, next) {
  // Known application errors
  if (err instanceof AppError) {
    return res.status(err.status).json({
      error: {
        code: err.code,
        message: err.message,
        ...(err.details.length > 0 && { details: err.details }),
      },
    });
  }

  // Multer file-size / mime errors
  if (err.code === 'LIMIT_FILE_SIZE') {
    return res.status(413).json({
      error: { code: 'PAYLOAD_TOO_LARGE', message: 'File exceeds the 2 MB limit.' },
    });
  }

  // Log unexpected errors server-side; never leak them
  console.error('Unhandled error:', err);

  return res.status(500).json({
    error: {
      code: 'INTERNAL',
      message: 'An unexpected error occurred. Please try again later.',
      // In dev, include the original message for faster debugging
      ...(env.NODE_ENV === 'development' && { detail: err.message }),
    },
  });
}
