import {IGameBoard} from './game-board.interface';
import ndarray from 'ndarray';
import {MoveOutcomeEvent} from '../../../minesweep/dto/replies/move-outcome-event.value';
import {GameState} from '../../../minesweep/dto/replies/game-status.enum';
import {CellRevelation} from '../../../minesweep/dto/replies/cell-revelation.value';

export class GameBoard implements IGameBoard {
   private nextMoveId: number;

   private hiddenCellCount: number;

   private safeCellCount: number;

   constructor(
      private readonly xSize: number,
      private readonly ySize: number,
      mineCount: number,
      private readonly cellGrid: ndarray,
      private readonly boundaryGen: (xIndex: number, yIndex: number) => IterableIterator<[number, number]>
   ) {
      this.nextMoveId = 1;
      this.hiddenCellCount = cellGrid.size;
      this.safeCellCount = cellGrid.size - mineCount;
   }

   public makeMove(sequenceId: number, xCell: number, yCell: number): MoveOutcomeEvent
   {
      if (sequenceId != this.nextMoveId) {
         throw new Error(`${sequenceId} indicates move is out-of-sequence`);
      }
      if ((xCell > (this.xSize - 1)) || (xCell < 0)) {
         throw new Error(`x dimension, ${xCell}, is out of bounds.`);
      }
      if ((yCell > (this.ySize - 1)) || (yCell < 0)) {
         throw new Error(`y dimension, ${yCell}, is out of bounds.`);
      }

      let gameStatus: GameState = GameState.PLAYING;
      let content = this.cellGrid.get(xCell, yCell);
      const revealedCells: CellRevelation[] = [{xCell, yCell, content}];
      this.cellGrid.set(xCell, yCell, -1);
      this.hiddenCellCount--;

      if (content < 0) {
         return {
            gameStatus,
            hiddenCellCount: this.hiddenCellCount,
            safeCellCount: this.safeCellCount,
            revealedCells: []
         };
      } else if (content == 9) {
         gameStatus = GameState.FAILED;
      } else if (content < 0) {
         // Remove the reveal and re-increment the hidden count since we already
         // revealed targeted cell.
         revealedCells.pop();
         this.hiddenCellCount++;
      } else {
         if (content == 0) {
            this.expandRevealedCells(revealedCells, xCell, yCell);
         }

         if (--this.safeCellCount == 0) {
            gameStatus = GameState.WINNER;
         }
      }

      this.nextMoveId++;

      return {
         gameStatus,
         hiddenCellCount: this.hiddenCellCount,
         safeCellCount: this.safeCellCount,
         revealedCells
      };
   }

   private expandRevealedCells(
      revealedCells: CellRevelation[], fromXCell: number, fromYCell: number) {
      for (let [xCell, yCell] of this.boundaryGen(fromXCell, fromYCell)) {
         const content = this.cellGrid.get(xCell, yCell);
         if (content < 0) {
            return;
         }

         this.cellGrid.set(xCell, yCell, -1);
         revealedCells.push({xCell, yCell, content});
         if (content == 0) {
            this.expandRevealedCells(revealedCells, xCell, yCell);
         }
      }
   }
}