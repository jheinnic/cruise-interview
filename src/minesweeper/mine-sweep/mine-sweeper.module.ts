import session from 'express-session';

import {MiddlewareConsumer, Module, NestModule} from '@nestjs/common';
import {MongooseModule} from '@nestjs/mongoose';
import {GameBoardSchema} from './entity/game-board.schema.js';
import {GameBoardService} from './game-board.service.js';
import {MineSweeperController} from './mine-sweeper.controller.js';
import {UtilityModule} from '../utility/utility.module.js';
import {UTILITY_DI_TYPES} from '../utility/di.symbols.js';

@Module({
   imports: [
      MongooseModule.forFeature([
         {
            name: 'GameBoard',
            schema: GameBoardSchema
         }
      ]),
      UtilityModule,
   ],
   controllers: [MineSweeperController],
   providers: [
      {
         provide: UTILITY_DI_TYPES.GameBoardService,
         useClass: GameBoardService
      }
   ],
})
export class MineSweeperModule implements NestModule
{
   public configure(consumer: MiddlewareConsumer): MiddlewareConsumer | void
   {
      consumer.apply(session({
         secret: '343ji43j4n3jn4jk3n',
         resave: true,
         saveUninitialized: false
      }))
         .forRoutes('game');
   }

}