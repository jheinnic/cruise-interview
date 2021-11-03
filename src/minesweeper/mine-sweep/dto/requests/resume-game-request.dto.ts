import {IsUUID} from 'class-validator';
import {UUID} from '../../../utility/uuid.type.js';

export class ResumeGameRequestDto {
   @IsUUID()
   public readonly gameBoardUuid: UUID;

   constructor(gameBoardUuid: UUID) {
      this.gameBoardUuid = gameBoardUuid;
   }
}

export interface IResumeGameRequestDto extends ResumeGameRequestDto { }