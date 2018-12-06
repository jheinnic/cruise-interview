import {MiddlewareConsumer, Module, NestModule} from '@nestjs/common';
import {MongooseModule} from '@nestjs/mongoose';
import {GameBoardSchema} from './entity/game-board.schema';
import {GameBoardService} from './game-board.service';
import {MineSweeperController} from './mine-sweeper.controller';
import {UtilityModule} from '../utility/utility.module';
import {DI_TYPES} from '../utility/di.symbols';
import session from 'express-session';

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
         provide: DI_TYPES.GameBoardService,
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