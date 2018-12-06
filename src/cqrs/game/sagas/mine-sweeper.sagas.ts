import * as clc from 'cli-color';
import {Injectable} from '@nestjs/common';
import {Observable} from 'rxjs';
import {EventObservable, ICommand} from '@nestjs/cqrs';
import {GameBoardCreatedEvent} from '../events/impl/game-board-created.event';
import {delay, map} from 'rxjs/operators';
import {MakeMoveCommand} from '../commands/impl/make-move.command';

@Injectable()
export class MineSweeperSagas {
  dragonKilled = (events$: EventObservable<any>): Observable<ICommand> => {
    return events$
      .ofType(GameBoardCreatedEvent)
      .pipe(
        delay(1000),
        map(event => {
          console.log(clc.redBright('Inside [HeroesGameSagas] Saga'));
          return new MakeMoveCommand(event.heroId, 1, 2, 3);
        }),
      );
  }
}
