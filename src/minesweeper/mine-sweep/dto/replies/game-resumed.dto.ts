import {RevealedCellContent} from './revealed-cell-content.class.js';
import {IsDefined, IsPositive, IsUUID, Max} from 'class-validator';
import {UUID} from '../../../utility/uuid.type.js';

export class GameResumedDto
{
   @IsUUID()
   public readonly gameBoardId: UUID;

   @IsPositive()
   @Max(2147483647)
   public readonly latestTurnId: number;

   @IsDefined()
   public readonly cellsRevealed: ReadonlyArray<RevealedCellContent>;

   @IsPositive()
   public readonly safeCellsLeft: number;

   constructor(
      gameBoardId: UUID,
      latestTurnId: number,
      cellsRevealed: ReadonlyArray<RevealedCellContent>,
      safeCellsLeft: number
   )
   {
      this.gameBoardId = gameBoardId;
      this.latestTurnId = latestTurnId;
      this.cellsRevealed = cellsRevealed;
      this.safeCellsLeft = safeCellsLeft;
   }
}