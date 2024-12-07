import { randomUUID } from 'crypto';

import { Pagination } from '@/common/interface/pagination-search.result';

import { UserId } from '../domain/value-object/userId';
import { Email } from '../domain/value-object/email';
import { UserEntity } from '../domain/entities/user.entity';
import { Provider as UserProvider } from '../domain/enum/provider.enum';
import { Provider } from '../domain/value-object/provider';
import { CreateUserCommand } from '../application/commands/create-user.command';
import { UserResponse } from '../application/response/user.reponse';
import {
  FindUserByEmailQuery,
  FindUserByIdQuery,
  FindUserByPhoneNumberQuery,
} from '../application/queries';
import { ProfileResponse } from '../application/response/profile.response';
import { ProfileEntity } from '../domain/entities/profile.entity';
import { ProfileId } from '../domain/value-object/profileId';
import { CreateProfileCommand } from '../application/commands';

const id = 'f2e0ea0c-6251-4242-9c2b-1fbc9796e7ff';
const fullname = 'Test 123';
const email = 'test123@gmail.com';
const phone_number = '08765432192';
const password = 'password';
const provider = <UserProvider>'local';
const created_at = new Date('2024-12-07T05:02:18.004Z');
const updated_at = created_at;

const hashed_password = 'hashed_password';
const userId = new UserId(id);
const validEmail = new Email(email);
const validProvider = new Provider(provider);

const registerPayload = new CreateUserCommand(
  fullname,
  phone_number,
  email,
  password,
  provider,
);

const emailPayload = new FindUserByEmailQuery(email);
const idPayload = new FindUserByIdQuery(id);
const phoneNumberPayload = new FindUserByPhoneNumberQuery(phone_number);

const user = new UserEntity();
user.setId(userId);
user.setFullname(fullname);
user.setPassword(hashed_password);
user.setEmail(validEmail);
user.setPhoneNumber(phone_number);
user.setProvider(validProvider);
user.setCreatedAt(created_at);
user.setUpdatedAt(updated_at);

const userResponse: UserResponse = {
  id,
  fullname,
  email,
  phone_number,
  password: hashed_password,
  provider,
  is_verified: false,
  is_account_non_expired: true,
  is_account_non_locked: true,
  profiles: [],
  created_at: user.getCreatedAt,
  updated_at: user.getUpdatedAt,
};

const profile_id = '8ff2b3f5-61d3-4d98-b6d7-a46036c61995';
const secured_url = 'https://securedurl.com/test';
const profile_name = 'shelllbyyyyyy';
const avatar_url: Express.Multer.File = {
  fieldname: 'profile-picture',
  originalname: 'IMG_20240902_183620_630.jpg',
  encoding: '7bit',
  mimetype: 'image/jpeg',
  size: 216111,
  buffer: null,
  destination: '',
  filename: 'test',
  path: '',
  stream: null,
};

const profileId = new ProfileId('8ff2b3f5-61d3-4d98-b6d7-a46036c61995');

const profileResponse: ProfileResponse = {
  id: profile_id,
  user_id: userId.getValue,
  profile_name,
  avatar_url: secured_url,
  created_at: new Date('2024-12-07T05:02:18.004Z'),
  updated_at: new Date('2024-12-07T05:02:18.004Z'),
};

const profile = new ProfileEntity();
profile.setAvatarUrl(secured_url);
profile.setId(profileId);
profile.setProfileName(profile_name);
profile.setCreatedAt(new Date('2024-12-07T05:02:18.004Z'));
profile.setUpdatedAt(new Date('2024-12-07T05:02:18.004Z'));
profile.setUserId(userId);

const profileCommand = new CreateProfileCommand(
  userId.getValue,
  profile_name,
  avatar_url,
);

const mockClodinaryResponse = {
  asset_id: '9941d2711ec4806683871f3e1a100b8d',
  public_id: 'profile-picture/yo732eul8uebsibmtlur',
  version: 1733546556,
  version_id: '498ff3e3908d3c2d86c806c31a9917c8',
  signature: 'b20157715aefd32977fdf4ca2b03aca085e02be3',
  width: 1171,
  height: 1171,
  format: 'jpg',
  resource_type: 'image',
  created_at: '2024-12-07T04:42:36Z',
  tags: [],
  bytes: 216111,
  type: 'upload',
  etag: '1fcd4a01f9990921e83b1a54dd1a2ce1',
  placeholder: false,
  url: 'http://securedurl.com/test',
  secure_url: 'https://securedurl.com/test',
  asset_folder: 'profile-picture',
  display_name: 'yo732eul8uebsibmtlur',
  original_filename: 'file',
  api_key: 'apikey',
};

const query: Record<string, any> = {};

const access_token = 'access_token';
const refresh_token = 'refresh_token';

const JwtPayload = {
  sub: id,
  email: email,
};

const paginationUserResponse: Pagination<UserResponse[]> = {
  data: [userResponse, userResponse, userResponse],
  limit: 10,
  page: 1,
  total: 3,
  total_pages: 1,
};

const paginationUserEntity: Pagination<UserEntity[]> = {
  data: [user, user, user],
  limit: 10,
  page: 1,
  total: 3,
  total_pages: 1,
};

const mockRedisService = {
  del: jest.fn(),
  set: jest.fn(),
  get: jest.fn(),
};

const mockCloudinaryService = {
  uploadImageToCloudinary: jest.fn(),
  deleteImage: jest.fn(),
  extractPublicId: jest.fn(),
};

const mockProfileRepository = {
  save: jest.fn(),
  findById: jest.fn(),
  findByUserId: jest.fn(),
  update: jest.fn(),
  delete: jest.fn(),
};

const mockUserRepository = {
  save: jest.fn(),
  findByEmail: jest.fn(),
  findById: jest.fn(),
  findByPhoneNumber: jest.fn(),
  delete: jest.fn(),
  update: jest.fn(),
  findAll: jest.fn(),
  changePassword: jest.fn(),
  changeFullname: jest.fn(),
  changePhoneNumber: jest.fn(),
  changeEmail: jest.fn(),
  updateProvider: jest.fn(),
  lockAccount: jest.fn(),
  verifyUser: jest.fn(),
  filterBy: jest.fn(),
};

const mockBcryptService = {
  hashPassword: jest.fn(),
  comparePassword: jest.fn(),
};

const mockTokenizer = {
  generateToken: jest.fn(),
  validateToken: jest.fn(),
  decodeToken: jest.fn(),
};

const mockDatabaseService = {
  query: jest.fn(),
  transaction: jest.fn(),
};

const mockElasticService = {
  index: jest.fn(),
  bulkIndex: jest.fn(),
  searchExact: jest.fn(),
  search: jest.fn(),
  delete: jest.fn(),
  update: jest.fn(),
};

const mockQueryBus = {
  execute: jest.fn(),
};

const mockCommandBus = {
  execute: jest.fn(),
};

function deepCopy<T>(obj: T): T {
  return JSON.parse(JSON.stringify(obj));
}

export {
  id,
  fullname,
  email,
  phone_number,
  password,
  hashed_password,
  created_at,
  updated_at,
  provider,
  userId,
  validEmail,
  validProvider,
  user,
  userResponse,
  registerPayload,
  emailPayload,
  idPayload,
  phoneNumberPayload,
  query,
  JwtPayload,
  access_token,
  refresh_token,
  paginationUserResponse,
  paginationUserEntity,
  mockBcryptService,
  mockRedisService,
  mockTokenizer,
  mockUserRepository,
  mockDatabaseService,
  mockElasticService,
  deepCopy,
  mockQueryBus,
  mockCommandBus,
  mockCloudinaryService,
  mockProfileRepository,
  avatar_url,
  profileResponse,
  profile_name,
  secured_url,
  profile_id,
  profileId,
  profile,
  profileCommand,
  mockClodinaryResponse,
};
