import {Body, Controller, Inject, Post, Put, Session} from '@nestjs/common';
import {IGameBoardService} from './interfaces/game-board-service.interface.js';
import {IUuidGenerator} from '../utility/uuid-generator.interface.js';
import {UUID} from '../utility/uuid.type.js';
import {UTILITY_DI_TYPES} from '../utility/di.symbols.js';
import {CreateGameRequestDto} from './dto/requests/create-game-request.dto.js';
import {MakeMoveRequestDto} from './dto/requests/make-move-request.dto.js';


@Controller('/game')
export class MineSweeperController
{
   constructor(
      @Inject(UTILITY_DI_TYPES.GameBoardService) private readonly gameService: IGameBoardService,
      @Inject(UTILITY_DI_TYPES.UuidGenerator) private readonly uuidGenerator: IUuidGenerator
   ) { }

   @Post('/')
   public async createGameBoard(
      @Body() createGameDto: CreateGameRequestDto,
      @Session() session: Express.Session
   )
   {
      const gameBoardId: UUID = this.uuidGenerator.generate();
      session.gameBoardId = gameBoardId;

      return this.gameService.createGameBoard(gameBoardId, createGameDto);
   }

   @Put('/')
   public async makeMove(
      @Body() makeMoveDto: MakeMoveRequestDto,
      @Session() session: Express.Session
   )
   {
      const gameBoardId: UUID = session.gameBoardId;

      return this.gameService.makeMove(gameBoardId, makeMoveDto);
   }
}