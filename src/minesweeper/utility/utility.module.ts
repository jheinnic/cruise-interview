import {Module} from '@nestjs/common';
import {DI_TYPES} from './di.symbols';
import {RandomGenerator} from './random-generator.class';
import {UuidGenerator} from './uuid-generator.service';

@Module({
   imports: [],
   providers: [{
      provide: DI_TYPES.RandomGenerator,
      useClass: RandomGenerator
   }, {
      provide: DI_TYPES.UuidGenerator,
      useClass: UuidGenerator
   }],
   exports: [{
      provide: DI_TYPES.RandomGenerator,
      useClass: RandomGenerator
   }, {
      provide: DI_TYPES.UuidGenerator,
      useClass: UuidGenerator
   }],
})
export class UtilityModule {

}