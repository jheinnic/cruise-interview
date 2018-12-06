import {UUID} from './uuid.type';

export interface IUuidGenerator {
   generate(): UUID;
}