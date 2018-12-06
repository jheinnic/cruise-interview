import {Min} from 'class-validator';
import {MaxByProduct} from '../../../minesweeper/utility/validation/max-by-product.constraint';

export class CreateGameDto {
   @Min(3)
   public readonly xSize: number = 0;

   @Min(3)
   public readonly ySize: number = 0;

   @Min(1)
   @MaxByProduct(['xSize', 'ySize'])
   public readonly mineCount: number = 0;
}

export interface ICreateGameDto extends CreateGameDto { }