import {Body, Controller, Inject, Post, Put, Session} from '@nestjs/common';

import {DI_TYPES} from '../../../minesweeper/utility/di.symbols';
import {IMineSweeperService} from '../interfaces/mine-sweeper-service.interface';
import {CreateGameDto} from './create-game.dto';
import {MakeMoveDto} from './make-move.dto';
import {IUuidGenerator} from '../../../minesweeper/utility/uuid-generator.interface';
import {UUID} from '../../../minesweeper/utility/uuid.type';

@Controller('/game')
export class MineSweeperController
{
   constructor(
      @Inject(DI_TYPES.GameBoardService) private readonly gameService: IMineSweeperService,
      @Inject(DI_TYPES.UuidGenerator) private readonly uuidGenerator: IUuidGenerator
   ) { }

   @Post('/minesweeper')
   public async createGame(
      @Body() createGameDto: CreateGameDto,
      @Session() session: Express.Session
   )
   {
      const gameBoardId: UUID = this.uuidGenerator.generate();
      session.gameBoardId = gameBoardId;

      this.gameService.createBoard(
         gameBoardId, createGameDto.xSize, createGameDto.ySize, createGameDto.mineCount);
   }

   @Put('/minesweeper')
   public async makeMove(
      @Body() makeMoveDto: MakeMoveDto,
      @Session() session: Express.Session
   )
   {
      const gameBoardId: UUID = session.gameBoardId;
      this.gameService.makeMove(
         gameBoardId, makeMoveDto.moveId, makeMoveDto.xCell, makeMoveDto.yCell);
   }
}