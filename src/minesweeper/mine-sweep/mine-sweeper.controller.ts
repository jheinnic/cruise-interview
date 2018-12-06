import {Body, Controller, Inject, Post, Put, Session} from '@nestjs/common';
import {CreateGameDto} from '../../cqrs/game/web/create-game.dto';
import {MakeMoveDto} from '../../cqrs/game/web/make-move.dto';
import {IGameBoardService} from './interfaces/game-board-service.interface';
import {IUuidGenerator} from '../utility/uuid-generator.interface';
import {UUID} from '../utility/uuid.type';
import {DI_TYPES} from '../utility/di.symbols';


@Controller('/game')
export class MineSweeperController
{
   constructor(
      @Inject(DI_TYPES.GameBoardService) private readonly gameService: IGameBoardService,
      @Inject(DI_TYPES.UuidGenerator) private readonly uuidGenerator: IUuidGenerator
   ) { }

   @Post('/')
   public async createGameBoard(
      @Body() createGameDto: CreateGameDto,
      @Session() session: Express.Session
   )
   {
      const gameBoardId: UUID = this.uuidGenerator.generate();
      session.gameBoardId = gameBoardId;

      return this.gameService.createGameBoard(gameBoardId, createGameDto);
   }

   @Put('/')
   public async makeMove(
      @Body() makeMoveDto: MakeMoveDto,
      @Session() session: Express.Session
   )
   {
      const gameBoardId: UUID = session.gameBoardId;

      return this.gameService.makeMove(gameBoardId, makeMoveDto);
   }
}