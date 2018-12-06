import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import {MineSweeperModule} from '../mine-sweep/mine-sweeper.module';
import {UtilityModule} from '../utility/utility.module';

@Module({
   imports: [
      MongooseModule.forRoot('mongodb://localhost/nest'),
      MineSweeperModule,
   ],
})
export class ApplicationModule {

}