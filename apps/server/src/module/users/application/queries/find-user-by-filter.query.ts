export class FindUserByFilterQuery {
  constructor(
    public userId?: string,
    public profile_id?: string,
    public fullname?: string,
    public phone_number?: string,
    public email?: string,
    public is_verified?: boolean,
    public provider?: string,
    public order_by?: string,
    public limit?: number,
    public created_at?: Date,
    public created_at_start?: Date,
    public created_at_end?: Date,
    public page?: number,
  ) {}
}
