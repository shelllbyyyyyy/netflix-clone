import { randomUUID } from 'crypto';
import { UserId } from '../entities/userId';
import { Email } from '../entities/email';
import { UserEntity } from '../entities/user.entity';
import { Provider as UserProvider } from '../enum/provider.enum';
import { Provider } from '../entities/provider';
import { CreateUserCommand } from '../commands/create-user.command';
import { UserResponse } from '../response/user.reponse';
import {
  FindUserByEmailQuery,
  FindUserByIdQuery,
  FindUserByPhoneNumberQuery,
} from '../queries';
import { QueryResult } from 'pg';
import { Pagination } from '@/common/interface/pagination-search.result';

const id = randomUUID();
const fullname = 'Test 123';
const email = 'test123@gmail.com';
const phone_number = '08765432192';
const password = 'password';
const provider = <UserProvider>'local';

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
  search: jest.fn(),
  delete: jest.fn(),
  update: jest.fn(),
};

export {
  id,
  fullname,
  email,
  phone_number,
  password,
  hashed_password,
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
  paginationUserResponse,
  paginationUserEntity,
  mockBcryptService,
  mockRedisService,
  mockTokenizer,
  mockUserRepository,
  mockDatabaseService,
  mockElasticService,
};
