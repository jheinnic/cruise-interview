import {ErrorCode} from './error-code.enum.js';
import {IsDefined, IsNotEmpty, IsNotIn} from 'class-validator';

export class ErrorEvent {
   @IsDefined()
   @IsNotIn([ErrorCode.OK])
   public readonly errorCode: ErrorCode = ErrorCode.OK;

   @IsNotEmpty()
   message: string = '';
}
