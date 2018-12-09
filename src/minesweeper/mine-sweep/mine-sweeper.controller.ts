import {Body, Controller, Inject, Post, Put, Session} from '@nestjs/common';
import {IGameBoardService} from './interfaces/game-board-service.interface';
import {IUuidGenerator} from '../utility/uuid-generator.interface';
import {UUID} from '../utility/uuid.type';
import {UTILITY_DI_TYPES} from '../utility/di.symbols';
import {CreateGameRequestDto} from './dto/requests/create-game-request.dto';
import {MakeMoveRequestDto} from './dto/requests/make-move-request.dto';


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