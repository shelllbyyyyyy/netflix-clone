export type UserResponse = {
  id: string;
  fullname: string;
  phone_number: string;
  email: string;
  password: string;
  provider: string;
  is_verified: boolean;
  is_account_non_locked: boolean;
  is_account_non_expired: boolean;
  profiles?: any[];
};
