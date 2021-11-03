import {DynamicModule, Module, SingleScope} from '@nestjs/common';
import {UTILITY_DI_TYPES} from './di.symbols.js';
import {RandomGenerator} from './random-generator.class.js';
import {V1UuidGenerator} from './v1-uuid-generator.service.js';
import {V4UuidGenerator} from './v4-uuid-generator.service.js';

@SingleScope()
@Module({
   imports: [],
   providers: [{
      provide: UTILITY_DI_TYPES.RandomGenerator,
      useClass: RandomGenerator
   }, {
      provide: UTILITY_DI_TYPES.UuidGenerator,
      useClass: V1UuidGenerator
   }],
   exports: [{
      provide: UTILITY_DI_TYPES.RandomGenerator,
      useClass: RandomGenerator
   }, {
      provide: UTILITY_DI_TYPES.UuidGenerator,
      useClass: V1UuidGenerator
   }],
})
export class UtilityModule
{
   /**
    * @param nodeId Set a 6 byte node ID to use.  Current implementation always
    *        uses system clock for the time aspect.
    */
   forUuidV1Feature(nodeId: Uint8Array): DynamicModule {
      return {
         module: UtilityModule,
         providers: this.createV1Providers(nodeId)
      };
   }

   /**
    * @param prng Factory method expected to return a sufficiently random array
    *        of 16 bytes, and called once per requested UUID.
    */
   forUuidV4Feature(prng: () => number[]): DynamicModule
   {
      return {
         module: UtilityModule,
         providers: this.createV4Providers(prng)
      };
   }

   private createV1Providers(nodeId: Uint8Array)
   {
      return [
         {
            provide: UTILITY_DI_TYPES.V1UuidOptions,
            useFactory: () => nodeId
         },
         {
            provide: UTILITY_DI_TYPES.V1UuidGenerator,
            useClass: V1UuidGenerator
         }
      ];
   }

   private createV4Providers(prng: () => number[])
   {
      return [
         {
            provide: UTILITY_DI_TYPES.V4UuidOptions,
            useFactory: () => prng
         },
         {
            provide: UTILITY_DI_TYPES.V4UuidGenerator,
            useClass: V4UuidGenerator
         }
      ];
   }
}