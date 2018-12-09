import {
   BadRequestException, ConflictException, Inject, Injectable, NotAcceptableException,
   NotFoundException
} from '@nestjs/common';
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
import {UUID} from '../utility/uuid.type';
import {UTILITY_DI_TYPES} from '../utility/di.symbols';

@Injectable()
export class GameBoardService implements IGameBoardService
{
   constructor(
      @InjectModel('GameBoard') private readonly gameBoardModel: Model<IGameBoard>,
      @Inject(UTILITY_DI_TYPES.RandomGenerator) private readonly randomGenerator: IRandomGenerator)
   {}

   async createGameBoard(gameBoardId: UUID, {xSize, ySize, mineCount}: CreateGameRequestDto): Promise<GameCreatedDto>
   {
      const cellIndexMap = getCellIndexToCoordinates(xSize, ySize);
      const cellBoundaryGen = getCellBoundaryGenerator(xSize, ySize);

      const cellCount = xSize * ySize;
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

      const nextTurnId = this.randomGenerator.randomInt();
      const createdGameBoard = new this.gameBoardModel({
         gameBoardId,
         nextTurnId,
         xSize,
         ySize,
         boardState,
         mineLocations: cellIndices.slice(0, mineCount),
         safeCellsLeft: cellCount - mineCount
      });

      await createdGameBoard.save();

      return new GameCreatedDto(gameBoardId, nextTurnId);
   }

   async makeMove(gameBoardId: UUID, {turnId, xCell, yCell} : MakeMoveRequestDto): Promise<PlayerTurnOutcomeDto>
   {
      const gameBoardList: IGameBoard[] =
         await this.gameBoardModel.find({ gameBoardId }).exec();

      if (gameBoardList.length < 1) {
         throw new NotFoundException(`No game board found for ${gameBoardId}`);
      } else if(gameBoardList.length > 1) {
         throw new ConflictException(`More than one game board found for ${gameBoardId}`);
      }

      const gameBoard = gameBoardList[0];

      if (gameBoard.nextTurnId < 0) {
         if (gameBoard.safeCellsLeft > 0) {
            throw new NotAcceptableException(`Game ${gameBoardId} has already ended for a loss`);
         } else {
            throw new NotAcceptableException(`Game ${gameBoardId} has already ended for a win`);
         }
      }
      if (turnId !== gameBoard.nextTurnId) {
         throw new NotAcceptableException(`${turnId} not equal to ${gameBoard.nextTurnId} indicates move is out-of-sequence`);
      }
      if ((xCell >= gameBoard.xSize) || (xCell < 0)) {
         throw new BadRequestException(`x dimension, ${xCell}, is out of bounds.`);
      }
      if ((yCell >= gameBoard.ySize) || (yCell < 0)) {
         throw new BadRequestException(`y dimension, ${yCell}, is out of bounds.`);
      }

      const cellGrid =
         ndarray(gameBoard.boardState, [gameBoard.xSize, gameBoard.ySize]);
      let cellsRevealed: RevealedCellContent[];
      let playerStatus: PlayerStatus = PlayerStatus.PLAYING;
      let content = cellGrid.get(xCell, yCell);

      if (content == 9) {
         // Don't add player's chosen cell to reveal list yet so we don't wind up having
         // to worry about duplicating it while revealing remaining mines.
         playerStatus = PlayerStatus.DEFEATED;
         cellsRevealed = [];
      } else if (content >= 0) {
         cellGrid.set(xCell, yCell, -1);
         cellsRevealed = [{xCell, yCell, content}];

         if (content == 0) {
            const boundaryGen =
               getCellBoundaryGenerator(gameBoard.xSize, gameBoard.ySize);
            this.expandRevealedCells(
               cellsRevealed, cellGrid, boundaryGen, xCell, yCell);
         }

         gameBoard.safeCellsLeft = gameBoard.safeCellsLeft - cellsRevealed.length;

         if (gameBoard.safeCellsLeft == 0) {
            playerStatus = PlayerStatus.WINNER;
         }
      } else {
         throw new ConflictException(`${xCell}, ${yCell} has already been cleared in ${gameBoardId}`);
      }

      if (playerStatus === PlayerStatus.PLAYING) {
         // Set new turn Id to match on player's next move.
         gameBoard.nextTurnId = this.randomGenerator.randomInt();
      } else {
         // Since game is over, reveal mine locations and clear next-turn id.
         gameBoard.nextTurnId = -1;

         // Mine locations are stored using their one-dimensional index, so map
         // them back to cartesian coordinates for return signature compliance.
         const cellIndexMap =
            getCellIndexToCoordinates(gameBoard.xSize, gameBoard.ySize);
         for (let nextIndex of gameBoard.mineLocations) {
            const [xCell, yCell] = cellIndexMap(nextIndex);
            cellsRevealed.push({xCell, yCell, content: 9});
         }
      }

      const retVal = {
         playerStatus,
         nextTurnId: gameBoard.nextTurnId,
         cellsRevealed,
         safeCellsLeft: gameBoard.safeCellsLeft
      };
      console.log(retVal);

      // Save changes.  Note that completed games are not purged here so there is
      // historical record.  Be sure to account for purging this data at some point.
      await gameBoard.save();

      return retVal;
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
         if (content >= 0) {
            cellGrid.set(xCell, yCell, -1);
            revealedCells.push({xCell, yCell, content});
            if (content == 0) {
               this.expandRevealedCells(revealedCells, cellGrid, boundaryGen, xCell, yCell);
            }
         }
      }
   }
}
