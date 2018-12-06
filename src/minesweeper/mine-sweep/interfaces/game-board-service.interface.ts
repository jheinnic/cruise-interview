import {UUID} from '../../utility/uuid.type';
import {ICreateGameRequestDto} from '../dto/requests/create-game-request.dto';
import {IMakeMoveRequestDto} from '../dto/requests/make-move-request.dto';
import {IGameCreatedDto} from '../dto/replies/game-created.dto';
import {IPlayerTurnOutcomeDto} from '../dto/replies/player-turn-outcome.dto';

export interface IGameBoardService {
   createGameBoard(boardId: UUID, createGameBoardDto: ICreateGameRequestDto): Promise<IGameCreatedDto>;

   makeMove(boardId: UUID, makeMoveRequestDto: IMakeMoveRequestDto): Promise<IPlayerTurnOutcomeDto>;
}