import {CellRevelation} from './cell-revelation.value';
import {GameState} from './game-status.enum';
import {UUID} from '../../../../minesweeper/utility/uuid.type';
import {RevealedCellContent} from './revealed-cell-content.class';

export interface PlayerSurvivedMoveEvent {
   readonly gameBoardId: UUID;
   readonly playerMoveId: number;
   readonly cellsRevealed: ReadonlyArray<RevealedCellContent>
}
