import {IsDefined, IsPositive, Max, Min} from 'class-validator';
import {RevealedCellContent} from './revealed-cell-content.class.js';
import {PlayerStatus} from './player-status.enum.js';

export class PlayerTurnOutcomeDto
{
   @IsPositive()
   @Max(2147483647)
   readonly nextTurnId: number;

   @IsDefined()
   readonly playerStatus: PlayerStatus;

   @IsDefined()
   readonly cellsRevealed: ReadonlyArray<RevealedCellContent>;

   @Min(0)
   readonly safeCellsLeft: number;

   constructor(
      nextTurnId: number,
      playerStatus: PlayerStatus,
      cellsRevealed: ReadonlyArray<RevealedCellContent>,
      safeCellsLeft: number
   )
   {
      this.nextTurnId = nextTurnId;
      this.playerStatus = playerStatus;
      this.cellsRevealed = cellsRevealed;
      this.safeCellsLeft = safeCellsLeft;
   }
}

export interface IPlayerTurnOutcomeDto extends PlayerTurnOutcomeDto { }
