/**
 * Factory class for generating Custom throw error.
 *
 * This utility is used to standardize error responses across the application.
 *
 * @returns {Object} An error response object containing:
 *   - `message` {string}: A detailed explanation of the operation that failed.
 *   - `errors`  {string}: Throw custom error.
 */

export class InvalidInputError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'InvalidInputError';
  }
}
