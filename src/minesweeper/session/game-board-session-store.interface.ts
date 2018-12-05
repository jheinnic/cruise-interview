import {GameBoard} from '../domain/game-board.class';

export interface GameBoardSessionStore {
   getGameState(): GameBoard;

   setGameState(): GameBoard;
}