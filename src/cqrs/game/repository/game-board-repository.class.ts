mport { Injectable } from '@nestjs/common';
import { Hero } from '../models/hero.model';
import { userHero } from './fixtures/user';

@Injectable()
export class GameBoardRepository {
   async findOneById(id: number): Promise<GameBoard> {
      return gameBoard;
   }
}