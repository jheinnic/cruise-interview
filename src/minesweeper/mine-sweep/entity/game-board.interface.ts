import {UUID} from '../../utility/uuid.type.js';
import * as mongoose from 'mongoose';

export interface IGameBoard extends mongoose.Document {
   gameBoardId: UUID;
   nextTurnId: number;
   xSize: number;
   ySize: number;
   boardState: Int8Array;
   mineLocations: ReadonlyArray<number>;
   safeCellsLeft: number;
}