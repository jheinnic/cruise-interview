import {Inject, Injectable} from '@nestjs/common';
import uuid from 'uuid';
import {IUuidGenerator} from './uuid-generator.interface';
import {UUID} from './uuid.type';
import {UTILITY_DI_TYPES} from './di.symbols';

@Injectable()
export class V4UuidGenerator implements IUuidGenerator
{
   constructor(
      @Inject(UTILITY_DI_TYPES.V4UuidOptions) private readonly rng: () => number[])
   { }

   public generate(): UUID
   {
      return uuid.v4({rng: this.rng}) as UUID;
   }
}