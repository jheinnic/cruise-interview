import {Inject, Injectable, Optional} from '@nestjs/common';
import uuid from 'uuid';
import {IUuidGenerator} from './uuid-generator.interface';
import {UUID} from './uuid.type';
import {UTILITY_DI_TYPES} from './di.symbols';

@Injectable()
export class V1UuidGenerator implements IUuidGenerator
{
   constructor(
      @Optional() @Inject(UTILITY_DI_TYPES.V1UuidOptions) private readonly nodeId?: number[]
   ) {
      if (! nodeId) {
         this.nodeId = new Array<number>(6);
         for( let ii=0; ii<6; ii++ ) {
            this.nodeId[ii] = Math.ceil(256 * Math.random());
         }
      }
   }

   public generate(): UUID
   {
      return uuid.v1({node: this.nodeId}) as UUID;
   }
}