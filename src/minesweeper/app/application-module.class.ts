import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import {MineSweeperModule} from '../mine-sweep/mine-sweeper.module.js';
import {UtilityModule} from '../utility/utility.module.js';

@Module({
   imports: [
      MongooseModule.forRoot('mongodb://localhost/nest'),
      UtilityModule,
      MineSweeperModule,
   ],
})
export class ApplicationModule {

}
