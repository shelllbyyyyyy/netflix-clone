import { Tokenizer } from '@/shared/libs/tokenizer';
import { GenerateRefreshToken } from '../service/generate-refresh-token';
import { Test, TestingModule } from '@nestjs/testing';
import {
  access_token,
  email,
  id,
  JwtPayload,
  mockTokenizer,
  refresh_token,
  userResponse,
} from '@/module/users/test/mock';

describe('Generate refresh token', () => {
  let generateRefreshToken: GenerateRefreshToken;
  let tokenizer: Tokenizer;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        GenerateRefreshToken,
        { provide: Tokenizer, useValue: mockTokenizer },
      ],
    }).compile();

    generateRefreshToken =
      module.get<GenerateRefreshToken>(GenerateRefreshToken);
    tokenizer = module.get<Tokenizer>(Tokenizer);

    jest.clearAllMocks();
  });

  it('Should be defined', () => {
    expect(tokenizer).toBeDefined();
    expect(generateRefreshToken).toBeDefined();
  });

  it('Should be success generate token', async () => {
    mockTokenizer.generateToken.mockResolvedValue(access_token);

    const result = await generateRefreshToken.execute({
      sub: id,
      email: email,
    });

    expect(result).toEqual({
      access_token,
    });
    expect(mockTokenizer.generateToken).toHaveBeenCalledWith(JwtPayload, '15m');
  });
  it('Should be fail generate token', async () => {
    mockTokenizer.generateToken.mockResolvedValue(null);

    const result = await generateRefreshToken.execute(null);

    expect(result).toBeNull();
    expect(mockTokenizer.generateToken).not.toHaveBeenCalled();
  });
});
