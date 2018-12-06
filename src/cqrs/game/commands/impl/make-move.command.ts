import {ICommand} from '@nestjs/cqrs';
import {UUID} from '../../../../minesweeper/utility/uuid.type';

export class MakeMoveCommand implements ICommand
{
   constructor(
      public readonly gameBoardId: UUID,
      public readonly moveId: UUID,
      public readonly xCell: number,
      public readonly yCell: number)
   { }
}


export interface IMakeMoveCommand extends MakeMoveCommand {}