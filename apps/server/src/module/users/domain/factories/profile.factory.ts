import { ProfileResponse } from '../../application/response/profile.response';
import { ProfileEntity } from '../entities/profile.entity';
import { ProfileId } from '../value-object/profileId';
import { UserId } from '../value-object/userId';

export class ProfileFactory {
  public static toDomain(data: ProfileResponse): ProfileEntity | null {
    if (!data) return null;

    const userId = new UserId(data.user_id);
    const id = new ProfileId(data.id);

    const profile = new ProfileEntity();
    profile.setId(id);
    profile.setProfileName(data.profile_name);
    profile.setAvatarUrl(data.avatar_url);
    profile.setUserId(userId);
    profile.setCreatedAt(data.created_at);
    profile.setUpdatedAt(data.updated_at);

    return profile;
  }

  public static toDomains(data: ProfileResponse[]): ProfileEntity[] {
    if (data.length === 0) return [];

    return data.map((d) => {
      const userId = new UserId(d.user_id);
      const id = new ProfileId(d.id);

      const profile = new ProfileEntity();
      profile.setId(id);
      profile.setProfileName(d.profile_name);
      profile.setAvatarUrl(d.avatar_url);
      profile.setUserId(userId);
      profile.setCreatedAt(d.created_at);
      profile.setUpdatedAt(d.updated_at);

      return profile;
    });
  }

  public static toResponse(data: ProfileEntity): ProfileResponse | null {
    if (!data) return null;

    const profile: ProfileResponse = {
      id: data.getId.getValue,
      user_id: data.getUserId.getValue,
      profile_name: data.getProfileName,
      avatar_url: data.getAvatarUrl,
      created_at: data.getCreatedAt,
      updated_at: data.getUpdatedAt,
    };

    return profile;
  }

  public static toResponses(data: ProfileEntity[]): ProfileResponse[] {
    if (data.length === 0) return [];

    return data.map((d) => {
      const profile: ProfileResponse = {
        id: d.getId.getValue,
        user_id: d.getUserId.getValue,
        profile_name: d.getProfileName,
        avatar_url: d.getAvatarUrl,
        created_at: d.getCreatedAt,
        updated_at: d.getUpdatedAt,
      };

      return profile;
    });
  }
}
