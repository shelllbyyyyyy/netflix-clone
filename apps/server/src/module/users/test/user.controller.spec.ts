import { CommandBus, CqrsModule, QueryBus } from '@nestjs/cqrs';
import { Test, TestingModule } from '@nestjs/testing';

import { UserController } from '../user.controller';
import { HandlerService } from '../application/service/handler-service';
import { mockCommandBus, mockQueryBus } from './mock';

describe('User Controller', () => {
  let userController: UserController;
  let queryBus: QueryBus;
  let commandBus: CommandBus;
  let handlerService: HandlerService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UserController],
      providers: [
        HandlerService,
        { provide: QueryBus, useValue: mockQueryBus },
        { provide: CommandBus, useValue: mockCommandBus },
      ],
    }).compile();

    queryBus = module.get<QueryBus>(QueryBus);
    commandBus = module.get<CommandBus>(CommandBus);
    userController = module.get<UserController>(UserController);
    handlerService = module.get<HandlerService>(HandlerService);
  });

  it('Should be defined', () => {
    expect(userController).toBeDefined();
    expect(queryBus).toBeDefined();
    expect(commandBus).toBeDefined();
    expect(handlerService).toBeDefined();
  });
});
