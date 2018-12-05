import 'reflect-metadata';
import {Container, interfaces} from 'inversify';
import express, {Express} from 'express';
import {DI_TYPES} from '../utility/di.symbols';
import {MinesweeperApp} from './minesweeper-app.service';
import {RandomGenerator} from '../utility/random-generator.class';
import {GameBoardFactory} from '../domain/game-board-factory.class';
import {IGameBoard} from '../domain/game-board.interface';
import {IRandomGenerator} from '../utility/random-generator.interface';
import {IGameBoardFactory} from '../domain/game-board-factory.interface';

const appContainer = new Container();
appContainer.bind<Express>(DI_TYPES.Express)
   .toConstantValue(express());
appContainer.bind<IRandomGenerator>(DI_TYPES.RandomSource)
   .to(RandomGenerator)
   .inSingletonScope();
appContainer.bind(DI_TYPES.GameBoardFactory)
   .to(GameBoardFactory)
   .inSingletonScope();
appContainer.bind(DI_TYPES.GameBoard)
   .toFactory(
      function (context: interfaces.Context): (
         xSize: number, ySize: number, mineCount: number) => IGameBoard
      {
         const factory: IGameBoardFactory =
            context.container.get(DI_TYPES.GameBoardFactory);
         return (xSize: number, ySize: number, mineCount: number): IGameBoard => {
            return factory.createBoard(xSize, ySize, mineCount);
         }
      }
   )

const main = appContainer.resolve(MinesweeperApp)
main.run();