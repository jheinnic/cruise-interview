import {Min} from 'class-validator';

export class MakeMoveCommand {
   @Min(1)
   public readonly moveId: number = 0;

   @Min(0)
   public readonly xCell: number = 0;

   @Min(0)
   public readonly yCell: number = 0;
}


export interface IMakeMoveCommand extends MakeMoveCommand { }