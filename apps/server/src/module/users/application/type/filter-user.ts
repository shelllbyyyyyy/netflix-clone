import { Email } from '../../domain/value-object/email';
import { UserId } from '../../domain/value-object/userId';

export type Filter = {
  id?: UserId;
  email?: Email;
  fullname?: string;
  phone_number?: string;
  profile_id?: string;
  created_at?: Date;
  created_at_start?: Date;
  created_at_end?: Date;
  limit?: number;
  offset?: number;
  order_by?: string;
  is_verified?: boolean;
};
