import { Email } from '../value-object/email';
import { Provider } from '../value-object/provider';
import { UserEntity } from '../entities/user.entity';
import { UserId } from '../value-object/userId';
import { UserResponse } from '../../application/response/user.reponse';
import { ProfileFactory } from './profile.factory';
import { ProfileEntity } from '../entities/profile.entity';

export class UserFactory {
  public static toDomain(data: any): UserEntity | null {
    if (!data) return null;
    const id = new UserId(data.id);
    const email = new Email(data.email);
    const provider = new Provider(data.provider);
    const profile = new Set<ProfileEntity>();

    const user = new UserEntity();
    user.setId(id);
    user.setFullname(data.fullname);
    user.setPhoneNumber(data.phone_number);
    user.setEmail(email);
    user.setPassword(data.password);
    user.setProvider(provider);
    user.setIsVerified(data.is_verified);
    user.setIsAccountExpired(data.is_account_non_expired);
    user.setIsAccountLocked(data.is_account_non_locked);
    user.setCreatedAt(data.created_at);
    user.setUpdatedAt(data.updated_at);

    if (data.profiles) {
      const profiles = ProfileFactory.toDomains(data.profiles);
      profiles.map((p) => profile.add(p));

      user.setProfiles(profile);
    }

    return user;
  }

  public static toDomains(data: any[]): UserEntity[] {
    if (data.length == 0) return [];

    return data.map((d) => {
      const id = new UserId(d.id);
      const email = new Email(d.email);
      const provider = new Provider(d.provider);
      const profile = new Set<ProfileEntity>();

      const user = new UserEntity();
      user.setId(id);
      user.setFullname(d.fullname);
      user.setPhoneNumber(d.phone_number);
      user.setEmail(email);
      user.setPassword(d.password);
      user.setProvider(provider);
      user.setIsVerified(d.is_verified);
      user.setIsAccountExpired(d.is_account_non_expired);
      user.setIsAccountLocked(d.is_account_non_locked);
      user.setCreatedAt(d.created_at);
      user.setUpdatedAt(d.updated_at);

      if (d.profiles) {
        const profiles = ProfileFactory.toDomains(d.profiles);
        profiles.map((p) => profile.add(p));

        user.setProfiles(profile);
      }

      return user;
    });
  }

  public static toResponse(data: UserEntity): UserResponse | null {
    if (!data) return null;

    const response: UserResponse = {
      id: data.getId.getValue,
      fullname: data.getFullname,
      phone_number: data.getPhoneNumber,
      email: data.getEmail.getValue,
      password: data.getPassword,
      provider: data.getProvider.getValue,
      is_verified: data.getIsVerified,
      is_account_non_expired: data.getIsAccountNonExpired,
      is_account_non_locked: data.getIsAccountNonLocked,
      profiles:
        data.getProfiles.length > 0
          ? ProfileFactory.toResponses(data.getProfiles)
          : [],
      created_at: data.getCreatedAt,
      updated_at: data.getUpdatedAt,
    };

    return response;
  }

  public static toResponses(data: UserEntity[]): UserResponse[] {
    if (data.length == 0) return [];

    return data.map((d) => {
      const response: UserResponse = {
        id: d.getId.getValue,
        fullname: d.getFullname,
        phone_number: d.getPhoneNumber,
        email: d.getEmail.getValue,
        password: d.getPassword,
        provider: d.getProvider.getValue,
        is_verified: d.getIsVerified,
        is_account_non_expired: d.getIsAccountNonExpired,
        is_account_non_locked: d.getIsAccountNonLocked,
        profiles:
          d.getProfiles.length > 0
            ? ProfileFactory.toResponses(d.getProfiles)
            : [],
        created_at: d.getCreatedAt,
        updated_at: d.getUpdatedAt,
      };

      return response;
    });
  }
}
