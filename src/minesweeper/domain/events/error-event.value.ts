import {ErrorCode} from './error-code.enum';

export interface ErrorEvent {
   errorCode: ErrorCode;
   message: string;
}
