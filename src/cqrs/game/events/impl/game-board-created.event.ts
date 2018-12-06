import { IEvent } from '@nestjs/cqrs';
import {UUID} from '../../../../minesweeper/utility/uuid.type';

export class GameBoardCreatedEvent implements IEvent {
    constructor(
       public readonly gameBoardId: UUID,
       public readonly xSize: number,
       public readonly ySize: number,
       public readonly mineLocations: ReadonlyArray<[number, number]>) {}
}