import {IsPositive, IsUUID, Max} from 'class-validator';
import {UUID} from '../../../utility/uuid.type';

export class GameCreatedDto
{
   @IsUUID()
   public readonly gameBoardId: UUID;

   @IsPositive()
   @Max(2147483647)
   public readonly nextTurnId: number;

   constructor( gameBoardId: UUID, nextTurnId: number )
   {
      this.gameBoardId = gameBoardId;
      this.nextTurnId = nextTurnId;
   }
}

export interface IGameCreatedDto extends GameCreatedDto { }