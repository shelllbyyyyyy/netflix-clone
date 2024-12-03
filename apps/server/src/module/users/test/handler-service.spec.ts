import { CommandBus } from '@nestjs/cqrs';
import { Test, TestingModule } from '@nestjs/testing';

import { HandlerService } from '../application/service/handler-service';
import { mockCommandBus } from './mock';

describe('Handler Service', () => {
  let handlerService: HandlerService;
  let commandBus: CommandBus;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        HandlerService,
        { provide: CommandBus, useValue: mockCommandBus },
      ],
    }).compile();

    commandBus = module.get<CommandBus>(CommandBus);
    handlerService = module.get<HandlerService>(HandlerService);

    jest.clearAllMocks();
  });

  it('Should be defined', () => {
    expect(handlerService).toBeDefined();
    expect(commandBus).toBeDefined();
  });
});
