import { estypes } from '@elastic/elasticsearch';

const USER_INDEX = 'users';

export const userSchema_v1: estypes.IndicesPutMappingRequest = {
  index: `${USER_INDEX}_v1`,
  date_detection: true,
  dynamic_date_formats: ['yyyy-MM-dd HH:mm:ss', 'yyyy-MM-dd'],
  numeric_detection: true,
  properties: {
    id: { type: 'keyword' },
    fullname: { type: 'text' },
    email: { type: 'keyword' },
    phone_number: { type: 'keyword' },
    password: { type: 'text', index: false },
    provider: { type: 'keyword' },
    is_verified: { type: 'boolean' },
    is_account_non_locked: { type: 'boolean' },
    is_account_non_expired: { type: 'boolean' },
    created_at: {
      type: 'date',
    },
    updated_at: {
      type: 'date',
    },
    profiles: {
      properties: {
        id: { type: 'keyword' },
        profile_name: { type: 'text' },
        avatar_url: { type: 'text' },
        created_at: {
          type: 'date',
        },
        updated_at: {
          type: 'date',
        },
      },
    },
  },
};
