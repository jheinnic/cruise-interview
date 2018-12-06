import {UUID} from '../../../minesweeper/utility/uuid.type';
import {CreateGameDto} from '../web/create-game.dto';
import {MakeMoveDto} from '../web/make-move.dto';

export interface IMineSweeperService {
   createBoard(boardId: UUID, createBoardDto: CreateGameDto): void;

   makeMove(boardId: UUID, boardVersion: UUID, makeMoveDto: MakeMoveDto): void;
}