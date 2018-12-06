import {IsUUID} from 'class-validator';
import {UUID} from '../../../utility/uuid.type';

export class ResumeGameRequestDto {
   @IsUUID()
   public readonly gameBoardId: UUID;

   constructor(gameBoardId: UUID) {
      this.gameBoardId = gameBoardId;
   }
}

export interface IResumeGameRequestDto extends ResumeGameRequestDto { }