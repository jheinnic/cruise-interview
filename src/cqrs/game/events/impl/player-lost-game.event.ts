import {UUID} from '../../../../minesweeper/utility/uuid.type';
import {RevealedCellContent} from './revealed-cell-content.class';

export interface PlayerLostGameEvent {
   readonly gameBoardId: UUID;
   readonly playerMoveId: number;
   readonly cellsRevealed: ReadonlyArray<RevealedCellContent>
}
