import * as clc from 'cli-color';
import { EventPublisher, ICommandHandler, CommandHandler } from '@nestjs/cqrs';
import {CreateGameCommand} from '../impl/create-game.command';
import {GameBoardRepository} from '../../repository/game-board-repository.class';
import {GameBoard} from '../../models/game-board.model';
import {IRandomGenerator} from '../../../../minesweeper/utility/random-generator.interface';
import {DI_TYPES} from '../../../../minesweeper/utility/di.symbols';
import {Inject} from '@nestjs/common';
import {getCellBoundaryGenerator} from '../../models/cell-boundary.function';
import {getCellIndexToCoordinates} from '../../models/cell-index-to-coordinates.function';
import ndarray from 'ndarray';

@CommandHandler(CreateGameCommand)
export class CreateGameCommandHandler implements ICommandHandler<CreateGameCommand> {
  constructor(
    private readonly repository: GameBoardRepository,
    @Inject( DI_TYPES.RandomGenerator) private readonly randomGenerator: IRandomGenerator,
    private readonly publisher: EventPublisher,
  ) {}

  async execute(
     { gameBoardId, xSize, ySize, mineCount }: CreateGameCommand,
     resolve: (value?: any) => void)
  {
     if ((xSize < 3) || (ySize < 3)) {
        throw new Error('Board size must be at least 3 cells in each dimension.');
     }
     if (mineCount < 1) {
        throw new Error('At least one mine is required');
     }
     const cellCount = xSize * ySize;

     if (mineCount >= cellCount) {
        throw new Error('mineCount must be less than the total grid size');
     }

     console.log(clc.greenBright('CreateBoardCommand...'));

     const cellIndexToCoordinates = getCellIndexToCoordinates(xSize, ySize);

     const mineLocations: ReadonlyArray<[number, number]> =
        this.placeMines(mineCount, cellCount, cellIndexToCoordinates);

     const GameBoardModel = this.publisher.mergeClassContext(GameBoard);
     const gameBoard = new GameBoardModel(gameBoardId);
     gameBoard.setupBoard(xSize, ySize, mineLocations);
     gameBoard.commit();
     resolve();

     // this.repository.persist(gameBoard);
  }

   private placeMines(
      mineCount: number,
      cellCount: number,
      cellIndexToCoordinates: (cellIndex: number) => [number, number]): ReadonlyArray<[number, number]>
   {
      let ii: number;
      const retVal: Array<[number, number]> = new Array<[number, number]>(mineCount);

      // Enumerate each distinct cell of the board grid by its projected one-dimensional
      // array index.
      const cellIndices = new Array<number>(cellCount);
      for (ii = 0; ii < cellCount; ii++) {
         cellIndices[ii] = ii;
      }

      // Shuffle the collection of one-dimensional indices and select the first |mineCount|
      // to decide where to place mines.
      this.randomGenerator.shuffle<number>(cellIndices);
      for (ii = 0; ii < mineCount; ii++) {
         const nextIndex: number = cellIndices[ii];
         retVal[ii] = cellIndexToCoordinates(nextIndex);
      }

      return retVal;
   }
}
   /*

   }
   */
