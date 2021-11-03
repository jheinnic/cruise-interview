import {MetadataMap, MetadataInspector} from '@loopback/metadata';
import {isKeyOf} from 'simplytyped';

import {AbstractCommand} from './absrtract-command.class.js';
import {COMMAND_HANDLER_MARKER_KEY, CommandHandlerMarker} from './command-handler-makrer.interface.js';

export abstract class AggregateRoot {
   private readonly propMap: MetadataMap<CommandHandlerMarker<any>> | undefined;

   constructor() {
      this.propMap = MetadataInspector.getAllMethodMetadata(
         COMMAND_HANDLER_MARKER_KEY, this.constructor.prototype );
   }

   public handleCommand(command: AbstractCommand): void {
      if (!! this.propMap) {
         for (let nextEntry in this.propMap) {
            if (isKeyOf(this, nextEntry)) {
               const guard = this.propMap[nextEntry].guard;
               if (guard(command)) {
                  const handler = this[nextEntry];
                  if (typeof handler == 'function') {
                     return handler.call(this, command);
                  }
               }
            }
         }
      }

      throw new Error(`No handler registered for ${command.type.toString()}`);
   }
}