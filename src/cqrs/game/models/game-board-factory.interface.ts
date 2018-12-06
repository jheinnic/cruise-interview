import {IGameBoard} from './game-board.interface';

export interface IGameBoardFactory {
   createBoard(xWidth: number, yWidth: number, mineCount: number): IGameBoard;
}