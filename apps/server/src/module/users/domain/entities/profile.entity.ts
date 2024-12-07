import { ProfileId } from '../value-object/profileId';
import { UserId } from '../value-object/userId';

export class ProfileEntity {
  private id: ProfileId;
  private user_id: UserId;
  private profile_name: string;
  private avatar_url: string;
  private created_at: Date;
  private updated_at: Date;

  constructor() {
    this.id = new ProfileId();
  }

  clone(): ProfileEntity {
    return Object.assign(Object.create(Object.getPrototypeOf(this)), this);
  }

  public get getId() {
    return this.id;
  }

  public setId(id: ProfileId) {
    this.id = id;
  }

  public get getUserId() {
    return this.user_id;
  }

  public setUserId(user_id: UserId) {
    this.user_id = user_id;
  }

  public get getProfileName() {
    return this.profile_name;
  }

  public setProfileName(profile_name: string) {
    this.profile_name = profile_name;
  }

  public get getAvatarUrl() {
    return this.avatar_url;
  }

  public setAvatarUrl(avatar_url: string) {
    this.avatar_url = avatar_url;
  }

  public get getCreatedAt() {
    return this.created_at;
  }

  public setCreatedAt(created_at: Date) {
    this.created_at = created_at;
  }

  public get getUpdatedAt() {
    return this.updated_at;
  }

  public setUpdatedAt(updated_at: Date) {
    this.updated_at = updated_at;
  }
}
