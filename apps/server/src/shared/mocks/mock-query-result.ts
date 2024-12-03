import { QueryResult, FieldDef } from 'pg';

/**
 * Factory function to create a reusable mock QueryResult
 * @param rows - Array of rows matching the expected type
 * @param command - SQL command type (e.g., 'SELECT', 'INSERT', etc.)
 * @param fields - Optional array of FieldDef objects
 * @param rowCount - Optional number of rows affected (default is rows.length)
 */
export const createMockQueryResult = <T>(
  rows: T[],
  command: string = 'SELECT',
  fields: FieldDef[] = [],
  rowCount?: number,
): QueryResult<T> => {
  return {
    command,
    oid: null,
    rows,
    fields: fields.length
      ? fields
      : Object.keys(rows[0] || {}).map(
          (name) => ({ name, format: 'text' }) as FieldDef,
        ),
    rowCount: rowCount ?? rows.length,
  };
};
