import { Tokenizer } from '@/shared/libs/tokenizer';
import { GenerateJwtToken } from '../service/generate-jwt-token';
import { Test, TestingModule } from '@nestjs/testing';
import {
  access_token,
  JwtPayload,
  mockTokenizer,
  refresh_token,
  userResponse,
} from '@/module/users/test/mock';

describe('Generate jwt token', () => {
  let generateJwtToken: GenerateJwtToken;
  let tokenizer: Tokenizer;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        GenerateJwtToken,
        { provide: Tokenizer, useValue: mockTokenizer },
      ],
    }).compile();

    generateJwtToken = module.get<GenerateJwtToken>(GenerateJwtToken);
    tokenizer = module.get<Tokenizer>(Tokenizer);

    jest.clearAllMocks();
  });

  it('Should be defined', () => {
    expect(tokenizer).toBeDefined();
    expect(generateJwtToken).toBeDefined();
  });

  it('Should be success generate token', async () => {
    mockTokenizer.generateToken.mockResolvedValueOnce(access_token);
    mockTokenizer.generateToken.mockResolvedValueOnce(refresh_token);

    const result = await generateJwtToken.execute(userResponse);

    expect(result).toEqual({
      access_token,
      refresh_token,
    });
    expect(mockTokenizer.generateToken).toHaveBeenCalledTimes(2);
    expect(mockTokenizer.generateToken).toHaveBeenNthCalledWith(
      1,
      JwtPayload,
      '15m',
    );
    expect(mockTokenizer.generateToken).toHaveBeenNthCalledWith(
      2,
      JwtPayload,
      '7d',
    );
  });
  it('Should be fail generate token', async () => {
    mockTokenizer.generateToken.mockResolvedValueOnce(null);
    mockTokenizer.generateToken.mockResolvedValueOnce(null);

    const result = await generateJwtToken.execute(null);

    expect(result).toBeNull();
    expect(mockTokenizer.generateToken).not.toHaveBeenCalledTimes(2);
    expect(mockTokenizer.generateToken).not.toHaveBeenNthCalledWith(
      1,
      JwtPayload,
      '15m',
    );
    expect(mockTokenizer.generateToken).not.toHaveBeenNthCalledWith(
      2,
      JwtPayload,
      '7d',
    );
  });
});
