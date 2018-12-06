import {ICommand} from '@nestjs/cqrs';
import {UUID} from '../../../../minesweeper/utility/uuid.type';

export class CreateGameCommand implements ICommand
{
   constructor(
      public readonly gameBoardId: UUID,
      public readonly xSize: number,
      public readonly ySize: number,
      public readonly mineCount: number)
   { }
}
