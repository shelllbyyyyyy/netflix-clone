import { Email } from '../value-object/email';
import { Provider } from '../value-object/provider';
import { UserId } from '../value-object/userId';
import { ProfileEntity } from './profile.entity';

export class UserEntity {
  private id: UserId;
  private fullname: string;
  private email: Email;
  private phone_number: string;
  private password: string;
  private provider: Provider;
  private isVerified: boolean;
  private isAccountNonExpired: boolean;
  private isAccountNonLocked: boolean;
  private profiles?: Set<ProfileEntity>;
  private created_at: Date;
  private updated_at: Date;

  constructor() {
    this.id = new UserId();
    this.provider = new Provider();
    this.isVerified = false;
    this.isAccountNonExpired = true;
    this.isAccountNonLocked = true;
    this.profiles = new Set<ProfileEntity>();
  }

  clone(): UserEntity {
    return Object.assign(Object.create(Object.getPrototypeOf(this)), this);
  }

  public get getId() {
    return this.id;
  }

  public setId(id: UserId) {
    this.id = id;
  }

  public get getFullname() {
    return this.fullname;
  }

  public setFullname(fullname: string) {
    this.fullname = fullname;
  }

  public get getPhoneNumber() {
    return this.phone_number;
  }

  public setPhoneNumber(phone_number: string) {
    this.phone_number = phone_number;
  }

  public get getEmail() {
    return this.email;
  }

  public setEmail(email: Email) {
    this.email = email;
  }

  public get getPassword() {
    return this.password;
  }

  public setPassword(password: string) {
    this.password = password;
  }

  public get getProvider() {
    return this.provider;
  }

  public setProvider(provider: Provider) {
    this.provider = provider;
  }

  public get getIsVerified() {
    return this.isVerified;
  }

  public setIsVerified(isVerified: boolean) {
    this.isVerified = isVerified;
  }

  public get getIsAccountNonExpired() {
    return this.isAccountNonExpired;
  }

  public setIsAccountExpired(data: boolean) {
    this.isAccountNonExpired = data;
  }

  public get getIsAccountNonLocked() {
    return this.isAccountNonLocked;
  }

  public setIsAccountLocked(data: boolean) {
    this.isAccountNonLocked = data;
  }

  public get getProfiles(): ProfileEntity[] {
    return Array.from(this.profiles);
  }

  public setProfiles(profiles: Set<ProfileEntity>) {
    this.profiles = profiles;
  }

  public get getCreatedAt(): Date {
    return this.created_at;
  }

  public setCreatedAt(created_at: Date) {
    this.created_at = created_at;
  }

  public get getUpdatedAt(): Date {
    return this.updated_at;
  }

  public setUpdatedAt(updated_at: Date) {
    this.updated_at = updated_at;
  }
}
