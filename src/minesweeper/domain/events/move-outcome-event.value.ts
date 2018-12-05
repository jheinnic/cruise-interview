import {CellRevelation} from './cell-revelation.value';
import {GameState} from './game-status.enum';

export interface MoveOutcomeEvent {
   gameStatus: GameState;
   hiddenCellCount: number;
   safeCellCount: number;
   revealedCells: CellRevelation[];
}
