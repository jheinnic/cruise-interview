import { NestFactory } from '@nestjs/core';
import { ApplicationModule } from './app/application-module.class.js';

async function bootstrap() {
   const app = await NestFactory.create(ApplicationModule);
   app.listen(3000, () => console.log('Application is listening on port 3000.'));
}
bootstrap();

// import 'reflect-metadata';
// import {Container, interfaces} from 'inversify';
// import express, {Express, RequestHandler} from 'express';
// import session from 'express-session';
//
// import {DI_TYPES} from './utility/di.symbols.js';
// import {MinesweeperApp} from './app/minesweeper-app.service.js';
// import {RandomGenerator} from './utility/random-generator.class.js';
// import {GameBoardFactory} from './domain/aggregates/game-board-factory.class.js';
// import {IGameBoard} from './domain/aggregates/game-board.interface.js';
// import {IRandomGenerator} from './utility/random-generator.interface.js';
// import {IGameBoardFactory} from './domain/aggregates/game-board-factory.interface.js';
// import {IUuidGenerator} from './utility/uuid-generator.interface.js';
// import {UuidGenerator} from './utility/uuid-generator.service.js';
//
// const appContainer = new Container();
// appContainer.bind<Express>(DI_TYPES.Express)
//    .toConstantValue(express());
// appContainer.bind<RequestHandler>(DI_TYPES.Session)
//    .toDynamicValue((_context: interfaces.Context) => {
//       return session(
//          {
//             cookie: { path: '/', httpOnly: true, secure: false, maxAge: undefined },
//             secret: '343ji43j4n3jn4jk3n',
//             resave: true,
//             saveUninitialized: false
//          }
//       );
//    })
//
// appContainer.bind<IUuidGenerator>(DI_TYPES.UuidGenerator)
//    .to(UuidGenerator)
//    .inSingletonScope();
// appContainer.bind<IRandomGenerator>(DI_TYPES.RandomGenerator)
//    .to(RandomGenerator)
//    .inSingletonScope();
// appContainer.bind(DI_TYPES.GameBoardFactory)
//    .to(GameBoardFactory)
//    .inSingletonScope();
// appContainer.bind(DI_TYPES.GameBoard)
//    .toFactory(
//       function (context: interfaces.Context): (
//          xSize: number, ySize: number, mineCount: number) => IGameBoard
//       {
//          const factory: IGameBoardFactory =
//             context.container.get(DI_TYPES.GameBoardFactory);
//          return (xSize: number, ySize: number, mineCount: number): IGameBoard => {
//             return factory.createBoard(xSize, ySize, mineCount);
//          }
//       }
//    )
//
// const main = appContainer.resolve(MinesweeperApp)
// main.run();