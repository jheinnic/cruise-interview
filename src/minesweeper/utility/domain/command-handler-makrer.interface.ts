import {MetadataAccessor} from '@loopback/metadata';
import {AbstractCommand} from './absrtract-command.class.js';

export interface CommandHandlerMarker<T extends AbstractCommand> {
   type: symbol,
   guard: (cmd: AbstractCommand) => cmd is T,
}

export const COMMAND_HANDLER_MARKER_KEY =
   MetadataAccessor.create<CommandHandlerMarker<any>, MethodDecorator>(
      'command-handler-marker-key');