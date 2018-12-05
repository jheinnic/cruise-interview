import {inject, injectable} from 'inversify';
import ndarray from 'ndarray';

import {IRandomGenerator} from '../utility/random-generator.interface';
import {IGameBoardFactory} from './game-board-factory.interface';
import {IGameBoard} from './game-board.interface';
import {GameBoard} from './game-board.class';
import {DI_TYPES} from '../utility/di.symbols';
import {getCellIndexToCoordinates} from './cell-index-to-coordinates.function';
import {getCellBoundaryGenerator} from './cell-boundary.function';

const HAS_MINE_CONSTANT = 9;

@injectable()
export class GameBoardFactory implements IGameBoardFactory {
   constructor(
      @inject(DI_TYPES.RandomSource) private readonly randomSource: IRandomGenerator
   ) {

   }
   public createBoard(xWidth: number, yWidth: number, mineCount: number): IGameBoard
   {
      if ((xWidth < 3) || (yWidth < 3)) {
         throw new Error('Board size must be at least 3 cells in each dimension.');
      }
      if (mineCount < 1) {
         throw new Error('At least one mine is required');
      }
      const cellCount = xWidth * yWidth;

      if (mineCount >= cellCount) {
         throw new Error('mineCount must be less than the total grid size');
      }

      const cellBoundaryGen = getCellBoundaryGenerator(xWidth, yWidth);
      const cellIndexToCoordinates = getCellIndexToCoordinates(xWidth, yWidth);
      const cellGrid = ndarray(
         new Int8Array(cellCount), [xWidth, yWidth]);

      this.placeMines(cellGrid, mineCount, cellIndexToCoordinates, cellBoundaryGen);

      return new GameBoard(xWidth, yWidth, mineCount, cellGrid, cellBoundaryGen);
   }

   private placeMines(
      cellGrid: ndarray,
      mineCount: number,
      cellIndexToCoordinates: (cellIndex: number) => [number, number],
      cellBoundaryGen: (xIndex: number, yIndex: number) => IterableIterator<[number, number]>)
   {
      let ii: number;
      const cellCount = cellGrid.size;

      // Enumerate each distinct cell of the board grid by its projected one-dimensional
      // array index.
      const cellIndices = new Array<number>(cellCount);
      for (ii = 0; ii < cellCount; ii++) {
         cellIndices[ii] = ii;
      }

      // Shuffle the collection of one-dimensional indices and select the first |mineCount|
      // to decide where to place mines.
      this.randomSource.shuffle<number>(cellIndices);
      for (ii = 0; ii < mineCount; ii++) {
         const nextIndex: number = cellIndices[ii];
         const [nextX, nextY]: [number, number] = cellIndexToCoordinates(nextIndex);

         console.log(ii, nextIndex, nextX, nextY);

         // Set the value of the mined cell to the marker constant of 9, then increment
         // the value of every surrounding cell that does not already have a mine by 1.
         cellGrid.set(nextX, nextY, HAS_MINE_CONSTANT);
         for (let [boundX, boundY] of cellBoundaryGen(nextX, nextY)) {
            const boundValue = cellGrid.get(boundX, boundY);
            if (boundValue < HAS_MINE_CONSTANT) {
               cellGrid.set(boundX, boundY, boundValue + 1);
               console.log(`** ${boundX},${boundY} => ${boundValue + 1}`);
            }
         }
      }

      console.log(cellIndices);
      console.log(cellGrid.data);
   }
}
