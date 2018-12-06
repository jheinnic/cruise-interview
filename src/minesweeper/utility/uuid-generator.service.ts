import {Injectable} from '@nestjs/common';
import uuid from 'uuid';
import {IUuidGenerator} from './uuid-generator.interface';
import {UUID} from './uuid.type';

@Injectable()
export class UuidGenerator implements IUuidGenerator
{
   public generate(): UUID
   {
      return uuid.v1({
        node: [128, 128, 128, 128, 128, 128]
      }) as UUID;
   }
}