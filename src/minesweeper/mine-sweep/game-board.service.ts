import {Inject, Injectable} from '@nestjs/common';
import {InjectModel} from '@nestjs/mongoose';
import {Model} from 'mongoose';
import ndarray = require('ndarray');

import {CreateGameRequestDto} from './dto/requests/create-game-request.dto';
import {MakeMoveRequestDto} from './dto/requests/make-move-request.dto';
import {PlayerTurnOutcomeDto} from './dto/replies/player-turn-outcome.dto';
import {GameCreatedDto} from './dto/replies/game-created.dto';
import {PlayerStatus} from './dto/replies/player-status.enum';
import {RevealedCellContent} from './dto/replies/revealed-cell-content.class';
import {IGameBoard} from './entity/game-board.interface';
import {getCellBoundaryGenerator} from './entity/cell-boundary.function';
import {getCellIndexToCoordinates} from './entity/cell-index-to-coordinates.function';
import {IGameBoardService} from './interfaces/game-board-service.interface';
import {HAS_MINE_CONTENT} from './interfaces/constants';
import {IRandomGenerator} from '../utility/random-generator.interface';
import {IUuidGenerator} from '../utility/uuid-generator.interface';
import {UUID} from '../utility/uuid.type';
import {DI_TYPES} from '../utility/di.symbols';

@Injectable()
export class GameBoardService implements IGameBoardService
{
   constructor(
      @InjectModel('GameBoard') private readonly gameBoardModel: Model<IGameBoard>,
      @Inject(DI_TYPES.RandomGenerator) private readonly randomGenerator: IRandomGenerator,
      @Inject(DI_TYPES.UuidGenerator) private readonly uuidGenerator: IUuidGenerator)
   {}

   async createGameBoard(gameBoardId: UUID, {xSize, ySize, mineCount}: CreateGameRequestDto): Promise<GameCreatedDto>
   {
      const cellCount = xSize * ySize;
      const cellIndexMap = getCellIndexToCoordinates(xSize, ySize);
      const cellBoundaryGen = getCellBoundaryGenerator(xSize, ySize);
      const boardState = new Int8Array(cellCount);
      const cellGrid = ndarray(boardState, [xSize, ySize]);

      const cellIndices = new Array<number>(cellCount);
      for (let ii = 0; ii < cellCount; ii++) {
         cellIndices[ii] = ii;
      }
      this.randomGenerator.shuffle(cellIndices);

      for (let ii = 0; ii < mineCount; ii++) {
         let [nextX, nextY] = cellIndexMap(cellIndices[ii]);
         // Set the value of the mined cell to the marker constant of 9, then increment
         // the value of every surrounding cell that does not already have a mine by 1.
         cellGrid.set(nextX, nextY, HAS_MINE_CONTENT);
         for (let [boundX, boundY] of cellBoundaryGen(nextX, nextY)) {
            const boundValue = cellGrid.get(boundX, boundY);
            if (boundValue != HAS_MINE_CONTENT) {
               cellGrid.set(boundX, boundY, boundValue + 1);
               console.log(`** ${boundX},${boundY} => ${boundValue + 1}`);
            }
         }
      }

      const nextTurnId = this.uuidGenerator.generate();
      const createdGameBoard = new this.gameBoardModel({
         gameBoardId,
         nextTurnId,
         xSize,
         ySize,
         boardState,
         mineLocations: cellIndices.slice(0, mineCount),
         hiddenCellsLeft: cellCount,
         safeCellsLeft: cellCount - mineCount
      });

      await createdGameBoard.save();

      return new GameCreatedDto(gameBoardId, nextTurnId);
   }

   async makeMove(gameBoardId: UUID, {turnId, xCell, yCell} : MakeMoveRequestDto): Promise<PlayerTurnOutcomeDto>
   {
      const gameBoardList: IGameBoard[] =
         await this.gameBoardModel.find({ gameBoardId }).exec();

      if (gameBoardList.length != 1) {
         console.error('Hey whats up!?');
         throw new Error();
      }
      const gameBoard = gameBoardList[0];

      if (turnId != gameBoard.nextTurnId) {
         throw new Error(`${turnId} not equal to ${gameBoard.nextTurnId} indicates move is out-of-sequence`);
      }
      if ((xCell > (gameBoard.xSize - 1)) || (xCell < 0)) {
         throw new Error(`x dimension, ${xCell}, is out of bounds.`);
      }
      if ((yCell > (gameBoard.ySize - 1)) || (yCell < 0)) {
         throw new Error(`y dimension, ${yCell}, is out of bounds.`);
      }

      const cellGrid =
         ndarray(gameBoard.boardState, [gameBoard.xSize, gameBoard.ySize]);
      let playerStatus: PlayerStatus = PlayerStatus.PLAYING;
      let content = cellGrid.get(xCell, yCell);
      const cellsRevealed: RevealedCellContent[] = [{xCell, yCell, content}];
      gameBoard.nextTurnId = this.uuidGenerator.generate();


      if (content == 9) {
         playerStatus = PlayerStatus.DEFEATED;
         gameBoard.hiddenCellsLeft--;
      } else if (content >= 0) {
         cellGrid.set(xCell, yCell, -1);
         gameBoard.hiddenCellsLeft--;

         if (content == 0) {
            const boundaryGen = getCellBoundaryGenerator(gameBoard.xSize, gameBoard.ySize)
            this.expandRevealedCells(cellsRevealed, cellGrid, boundaryGen, xCell, yCell);
         }

         if (--gameBoard.safeCellsLeft == 0) {
            playerStatus = PlayerStatus.WINNER;
         }
      }

      await gameBoard.save();

      return {
         playerStatus,
         gameBoard.nextTurnId,
         cellsRevealed,
      };

   }

   async findAll(): Promise<IGameBoard[]>
   {
      return await this.gameBoardModel.find().exec();
   }


   private expandRevealedCells(
      revealedCells: RevealedCellContent[],
      cellGrid: ndarray<number>,
      boundaryGen: (xIndex: number, yIndex: number) => IterableIterator<[number, number]>,
      fromXCell: number,
      fromYCell: number)
   {
      for (let [xCell, yCell] of boundaryGen(fromXCell, fromYCell)) {
         const content = cellGrid.get(xCell, yCell);
         if (content < 0) {
            return;
         }

         cellGrid.set(xCell, yCell, -1);
         revealedCells.push({xCell, yCell, content});
         if (content == 0) {
            this.expandRevealedCells(revealedCells, cellGrid, boundaryGen, xCell, yCell);
         }
      }
   }
}

// // import express from 'express';
// import {inject, injectable} from 'inversify';
// // import SocketServer, {Socket} from 'socket.io';
// import {Express} from 'express';
// import * as WebSocket from 'ws';
// import * as http from 'http';
//
// import {DI_TYPES} from '../utility/di.symbols';
// import {IGameBoardFactory} from '../../cqrs/game/models/game-board-factory.interface';
// import {NewGameCommand} from './dto/requests/create-game-request.dto';
// import {transformAndValidateSync} from 'class-transformer-validator';
// import {IGameBoard} from '../../cqrs/game/models/game-board.interface';
// import {MakeMoveCommand} from './dto/requests/make-move-request.dto';
// import {ErrorCode} from './dto/replies/error-code.enum';
//
// @injectable()
// export class MineSweeperApp
// {
//    private static readonly createGamePattern = /^createGame:(.*)$/
//
//    private static readonly makeMovePattern = /^makeMove:(.*)$/
//
//    constructor(
//       @inject(DI_TYPES.Express) private readonly app: Express,
//       @inject(DI_TYPES.GameBoardFactory) private readonly gameFactory: IGameBoardFactory
//    )
//    {}
//
//    run(): void
//    {
//       // this.app.use(session({
//       //    secret: '343ji43j4n3jn4jk3n',
//       //    resave: true,
//       //    saveUninitialized: false
//       // }));
//
//       // this.app.get('/game', (_req, _res, _next) => {
//       // req.session
//       // })
//
//       //initialize a simple http server
//       const server = http.createServer(this.app);
//
//       //initialize the WebSocket server instance
//       const wss = new WebSocket.Server({server});
//       // const io = SocketServer(server);
//
//       server.listen(8000);
//
//       this.app.get('/', function (_req, res, _next) {
//          res.sendFile(__dirname + '/index.html');
//       });
//
//       wss.on('connection', (ws: WebSocket) => {
//          let game: IGameBoard | undefined = undefined;
//
//          ws.on('message', (message: string) => {
//             console.log('message', message);
//             let testResult;
//
//             testResult = message.match(MinesweeperApp.createGamePattern);
//             console.log(testResult);
//             if (!!testResult && (
//                testResult.length > 1
//             ))
//             {
//                const command = transformAndValidateSync(NewGameCommand, testResult[1]);
//                if (!Array.isArray(command)) {
//                   try {
//                      game = this.gameFactory.createBoard(
//                         command.xSize, command.ySize, command.mineCount);
//                      ws.send('gameCreated');
//                   } catch (err) {
//                      ws.send('error', err);
//                   }
//                }
//
//                return;
//             }
//
//             testResult = message.match(MinesweeperApp.makeMovePattern);
//             console.log(testResult);
//             if (!!testResult && (
//                testResult.length > 1
//             ))
//             {
//                const command = transformAndValidateSync(MakeMoveCommand, testResult[1]);
//                if (!Array.isArray(command)) {
//                   if (!game) {
//                      ws.send(
//                         'errorMsg:' + JSON.stringify(
//                         {
//                            errorCode: ErrorCode.NO_GAME_ACTIVE,
//                            message: 'Start a game before moving'
//                         }
//                         )
//                      );
//                   } else {
//                      try {
//                         const result =
//                            game.makeMove(command.moveId, command.xCell, command.yCell);
//                         ws.send('moveMade:' + JSON.stringify(result));
//                      } catch (err) {
//                         ws.send('errorMsg:' + JSON.stringify(err));
//                      }
//                   }
//                }
//
//                return;
//             }
//          })
//          ;
//       });
//    }
// }
