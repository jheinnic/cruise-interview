import mongoose from 'mongoose';

export const GameBoardSchema = new mongoose.Schema({
   gameBoardId: {
      type: String,
      match: /[0-9a-fA-F]{8}\-[0-9a-fA-F]{4}\-[0-9a-fA-F]{4}\-[0-9a-fA-F]{4}\-[0-9a-fA-F]{12}/
   },
   nextTurnId: {
      type: String,
      match: /[0-9a-fA-F]{8}\-[0-9a-fA-F]{4}\-[0-9a-fA-F]{4}\-[0-9a-fA-F]{4}\-[0-9a-fA-F]{12}/
   },
   xSize: {
      type: Number,
      min: 3
   },
   ySize: {
      type: Number,
      min: 3
   },
   boardState: {
      type: [Number],
      get: (value: number[]) => {
         return Int8Array.from(value);
      },
      set: (value: Int8Array) => {
         return [...value];
      }
   },
   mineLocations: [Number],
   hiddenCellsLeft: {
      type: Number,
      min: 1
   },
   safeCellsLeft: {
      type: Number,
      min: 0
   },
});
