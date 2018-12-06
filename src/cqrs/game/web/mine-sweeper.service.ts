import {Injectable} from '@nestjs/common';
import {CommandBus} from '@nestjs/cqrs';
import {KillDragonDto} from '../interfaces/kill-dragon-dto.interface';
import {KillDragonCommand} from '../commands/impl/kill-dragon.command';
import {IMineSweeperService} from '../interfaces/mine-sweeper-service.interface';
import {UUID} from '../../../minesweeper/utility/uuid.type';
import {ICreateGameDto} from './create-game.dto';
import {CreateGameCommand} from '../commands/impl/create-game.command';
import {MakeMoveCommand} from '../commands/impl/make-move.command';
import {IMakeMoveDto} from './make-move.dto';

@Injectable()
export class MineSweeperService implements IMineSweeperService
{
   constructor(private readonly commandBus: CommandBus) {}

   async killDragon(heroId: string, killDragonDto: KillDragonDto)
   {
      return await this.commandBus.execute(
         new KillDragonCommand(heroId, killDragonDto.dragonId),
      );
   }

   public async createBoard(
      gameBoardId: UUID, createBoardDto: ICreateGameDto)
   {
      return await this.commandBus.execute(
         new CreateGameCommand(
            gameBoardId, createBoardDto.xSize, createBoardDto.ySize, createBoardDto.mineCount)
      );

   }

   public async makeMove(
      gameBoardId: UUID, makeMoveDto: IMakeMoveDto)
   {
      return await this.commandBus.execute(
         new MakeMoveCommand(
            gameBoardId, makeMoveDto.moveId, makeMoveDto.xCell, makeMoveDto.yCell)
      );
   }
}
