import { IEvent } from '@nestjs/cqrs';
import {RevealedCellContent} from './revealed-cell-content.class';
import {IsDefined, IsPositive, IsUUID} from 'class-validator';
import {UUID} from '../../../utility/uuid.type';

export class GameResumedDto implements IEvent {
   @IsUUID()
   public readonly gameBoardId: UUID;

   @IsPositive()
   public readonly latestMoveId: number;

   @IsDefined()
   public readonly cellsRevealed: ReadonlyArray<RevealedCellContent>;
    constructor(
       gameBoardId: UUID,
       latestMoveId: number,
       cellsRevealed: ReadonlyArray<RevealedCellContent>
    )
    {
       this.gameBoardId = gameBoardId;
       this.latestMoveId = latestMoveId;
       this.cellsRevealed = cellsRevealed;
    }
}