import {UUID} from '../../utility/uuid.type.js';
import {ICreateGameRequestDto} from '../dto/requests/create-game-request.dto.js';
import {IMakeMoveRequestDto} from '../dto/requests/make-move-request.dto.js';
import {IGameCreatedDto} from '../dto/replies/game-created.dto.js';
import {IPlayerTurnOutcomeDto} from '../dto/replies/player-turn-outcome.dto.js';

export interface IGameBoardService {
   createGameBoard(boardId: UUID, createGameBoardDto: ICreateGameRequestDto): Promise<IGameCreatedDto>;

   makeMove(boardId: UUID, makeMoveRequestDto: IMakeMoveRequestDto): Promise<IPlayerTurnOutcomeDto>;
}