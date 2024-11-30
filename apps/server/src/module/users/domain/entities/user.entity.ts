import { Email } from '../value-object/email';
import { Provider } from '../value-object/provider';
import { UserId } from '../value-object/userId';

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

  constructor() {
    this.id = new UserId();
    this.provider = new Provider();
    this.isVerified = false;
    this.isAccountNonExpired = true;
    this.isAccountNonLocked = true;
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
}
