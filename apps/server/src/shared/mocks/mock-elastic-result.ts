import { estypes } from '@elastic/elasticsearch';

/**
 * Factory to create a mock Elasticsearch response
 * @param hits - Array of hits (documents) to include in the response
 * @param took - Optional time taken for the query (default: 10ms)
 * @param total - Optional total count of hits (default: hits.length)
 * @param aggregations - Optional aggregations object
 */
export const createMockElasticResponse = <T>(
  hits: T[] = [],
  took: number = 10,
  total: number = hits.length,
  aggregations?: Record<string, unknown>,
) => {
  return {
    took,
    timed_out: false,
    _shards: {
      total: 1,
      successful: 1,
      skipped: 0,
      failed: 0,
    },
    hits: {
      total: { value: total, relation: 'eq' },
      max_score: hits.length > 0 ? 1.0 : null,
      hits: hits.map((source, index) => ({
        _index: 'mock-index',
        _type: '_doc',
        _id: `mock-id-${index}`,
        _score: 1.0,
        _source: source,
      })),
    },
    aggregations: aggregations || undefined,
  };
};

export const createMockByWriteResponse = (
  id: string,
  index: string,
  result: 'created' | 'updated' | 'deleted' | 'not_found' | 'noop',
  total: number,
  successful: number,
  failed: number,
): estypes.WriteResponseBase => {
  return {
    _id: id,
    _index: index,
    result: result,
    _seq_no: 3,
    _shards: {
      total: total,
      successful: successful,
      failed: failed,
    },
    _version: 3,
  };
};
