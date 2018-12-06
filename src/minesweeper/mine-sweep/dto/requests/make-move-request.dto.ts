import {IsUUID, Min} from 'class-validator';
import {UUID} from '../../../utility/uuid.type';

export class MakeMoveRequestDto {
   @IsUUID()
   public readonly turnId: UUID = '' as UUID;

   @Min(0)
   public readonly xCell: number = 0;

   @Min(0)
   public readonly yCell: number = 0;
}


export interface IMakeMoveRequestDto extends MakeMoveRequestDto { }