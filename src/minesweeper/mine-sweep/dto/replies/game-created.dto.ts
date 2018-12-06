import {IsUUID} from 'class-validator';
import {UUID} from '../../../utility/uuid.type';

export class GameCreatedDto
{
   @IsUUID()
   public readonly gameBoardId: UUID;

   @IsUUID()
   public readonly nextMoveId: UUID;

   constructor( gameBoardId: UUID, nextMoveId: UUID )
   {
      this.gameBoardId = gameBoardId;
      this.nextMoveId = nextMoveId;
   }
}

export interface IGameCreatedDto extends GameCreatedDto { }