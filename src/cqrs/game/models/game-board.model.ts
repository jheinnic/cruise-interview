import { AggregateRoot } from '@nestjs/cqrs';
import { GameBoardCreatedEvent } from '../events/impl/game-board-created.event';

export class GameBoard extends AggregateRoot {
   private gameBoardId: UUID;
   private xSize: number;
   private ySize: number;
   private boardState: Int8Array;
   private mineLocations: [number, number][];
   private hiddenCellsLeft: number;
   private safeCellsLeft: number;

   constructor(private readonly id: UUID) {
      super();
      this.gameBoardId = id;
      this.xSize = -1;
      this.ySize = -1;
      this.boardState = Int8Array.from([]);
      this.mineLocations = [];
      this.hiddenCellsLeft = -1;
      this.safeCellsLeft = -1;
   }

   setupBoard(xSize: number, ySize: number, mineLocations: ReadonlyArray<[number, number]>)
   {
      this.apply(
         new GameBoardCreatedEvent(this.id, xSize, ySize, mineLocations);
   }


   onGameBoardCreatedEvent(event: GameBoardCreatedEvent)
   {
      const cellBoundaryGen = getCellBoundaryGenerator(xSize, ySize);
      this.boardState = new Int8Array(cellCount), [xSize, ySize]);
      const cellGrid = ndarray(this.boardState, [xSize, ySize]);

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
