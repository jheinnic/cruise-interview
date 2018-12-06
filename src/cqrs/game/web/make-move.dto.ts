import {Min} from 'class-validator';

export class MakeMoveDto {
   @Min(1)
   public readonly moveId: number = 0;

   @Min(0)
   public readonly xCell: number = 0;

   @Min(0)
   public readonly yCell: number = 0;
}


export interface IMakeMoveDto extends MakeMoveDto { }