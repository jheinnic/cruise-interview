import {UUID} from './uuid.type.js';

export interface IUuidGenerator {
   generate(): UUID;
}