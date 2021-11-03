import {MethodDecoratorFactory} from '@loopback/metadata';
import {AbstractCommand} from './absrtract-command.class.js';
import {COMMAND_HANDLER_MARKER_KEY} from './command-handler-makrer.interface.js';

export function commandHandler<T extends AbstractCommand>(type: symbol) {
   function isCommandGuard(cmd: AbstractCommand): cmd is T {
      return cmd.type == type;
   }
   return MethodDecoratorFactory.createDecorator(
      COMMAND_HANDLER_MARKER_KEY, {type, guard: isCommandGuard});
}
