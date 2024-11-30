export type UserUpdate = {
  current_password?: string;
  email?: string;
  fullname?: string;
  password?: string;
  phone_number?: string;
  is_verified?: boolean;
  is_account_non_locked?: boolean;
  is_account_non_expired?: boolean;
  provider?: string;
};
