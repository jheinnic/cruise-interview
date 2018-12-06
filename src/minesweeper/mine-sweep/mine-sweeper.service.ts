import {Injectable} from '@nestjs/common';
import {CommandBus} from '@nestjs/cqrs';
import {ICreateGameRequestDto} from './dto/requests/create-game-request.dto';
import {IMakeMoveRequestDto} from './dto/requests/make-move-request.dto';
import {IMineSweeperService} from '../../cqrs/game/interfaces/mine-sweeper-service.interface';
import {UUID} from '../utility/uuid.type';
import {CreateGameCommand} from '../../cqrs/game/commands/impl/create-game.command';
import {MakeMoveCommand} from '../../cqrs/game/commands/impl/make-move.command';

@Injectable()
export class MineSweeperService implements IMineSweeperService
{
   constructor(private readonly commandBus: CommandBus) {}

   public async createGame(
      gameBoardId: UUID, createBoardDto: ICreateGameRequestDto)
   {
      return await this.commandBus.execute(
         new CreateGameCommand(
            gameBoardId, createBoardDto.xSize, createBoardDto.ySize, createBoardDto.mineCount)
      );

   }

   public async makeMove(
      gameBoardId: UUID, boardVersion: UUID, makeMoveDto: IMakeMoveRequestDto)
   {
      return await this.commandBus.execute(
         new MakeMoveCommand(
            gameBoardId, makeMoveDto.turnId, makeMoveDto.xCell, makeMoveDto.yCell)
      );
   }
}
