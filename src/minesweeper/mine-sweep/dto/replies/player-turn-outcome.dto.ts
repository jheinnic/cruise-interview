import {IsDefined, IsUUID} from 'class-validator';
import {RevealedCellContent} from './revealed-cell-content.class';
import {PlayerStatus} from './player-status.enum';
import {UUID} from '../../../utility/uuid.type';

export class PlayerTurnOutcomeDto
{
   @IsUUID()
   readonly nextTurnId: UUID;

   @IsDefined()
   readonly playerStatus: PlayerStatus;

   @IsDefined()
   readonly cellsRevealed: ReadonlyArray<RevealedCellContent>;

   constructor(
      nextTurnId: UUID,
      playerStatus: PlayerStatus,
      cellsRevealed: ReadonlyArray<RevealedCellContent>
   )
   {
      this.nextTurnId = nextTurnId;
      this.playerStatus = playerStatus;
      this.cellsRevealed = cellsRevealed;
   }
}

export interface IPlayerTurnOutcomeDto extends PlayerTurnOutcomeDto { }
