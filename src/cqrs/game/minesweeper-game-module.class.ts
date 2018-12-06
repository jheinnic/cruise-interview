import {Module, OnModuleInit} from '@nestjs/common';
import {CQRSModule, CommandBus, EventBus} from '@nestjs/cqrs';
import {ModuleRef} from '@nestjs/core';
import {MineSweeperController} from './web/mine-sweeper.controller';
import {MineSweeperSagas} from './sagas/mine-sweeper.sagas';
import {GameBoardRepository} from './repository/game-board-repository.class';
import {CreateGameCommandHandler} from './commands/handlers/create-game.command-handler';
import {MakeMoveCommandHandler} from './commands/handlers/make-move.command-handler';
import {MineSweeperService} from './web/mine-sweeper.service';

export const CommandHandlers = [CreateGameCommandHandler, MakeMoveCommandHandler];
export const EventHandlers =  [ ];

@Module({
   imports: [CQRSModule],
   controllers: [MineSweeperController],
   providers: [
      MineSweeperService,
      MineSweeperSagas,
      ...CommandHandlers,
      ...EventHandlers,
      GameBoardRepository,
   ]
})
export class MinesweeperGameModule implements OnModuleInit {
   constructor(
      private readonly moduleRef: ModuleRef,
      private readonly command$: CommandBus,
      private readonly event$: EventBus,
      private readonly mineSweeperSagas: MineSweeperSagas,
   ) {}

   onModuleInit() {
      this.command$.setModuleRef(this.moduleRef);
      this.event$.setModuleRef(this.moduleRef);

      this.event$.register(EventHandlers);
      this.command$.register(CommandHandlers);
      this.event$.combineSagas([
         this.mineSweeperSagas.dragonKilled,
      ]);
   }
}