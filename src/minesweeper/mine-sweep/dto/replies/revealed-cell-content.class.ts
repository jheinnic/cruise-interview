import {Max, Min} from 'class-validator';

export class RevealedCellContent
{
   @Min(0)
   readonly xCell: number,

   @Min(0)
   readonly yCell: number,

   @Min(0)
   @Max(9)
   readonly content: number

   constructor(
      xCell: number,
      yCell: number,
      content: number
   ) {
      this.xCell = xCell;
      this.yCell = yCell;
      this.content = content;
   }
}
