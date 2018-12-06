import {UUID} from '../../utility/uuid.type';
import * as mongoose from 'mongoose';

export interface IGameBoard extends mongoose.Document {
   // makeMove(turnId: UUID, xCell: number, yCell: number, callback: IMoveOutcomeCallback): void;

   //  match: /[0-9a-fA-F]{8}\-[0-9a-fA-F]{4}\-[0-9a-fA-F]{4}\-[0-9a-fA-F]{4}\-[0-9a-fA-F]{12}/
   gameBoardId: UUID;
   nextTurnId: UUID;
   xSize: number;
   ySize: number;
   boardState: Int8Array;
   mineLocations: ReadonlyArray<number>;
   hiddenCellsLeft: number;
   safeCellsLeft: number;
}