import {IRandomGenerator} from './random-generator.interface.js';
import {Injectable} from '@nestjs/common';

@Injectable()
export class RandomGenerator implements IRandomGenerator {
   public static readonly MAX_INT = 2147483647;

   public randomFloat(minValue: number = -1, maxValue: number = 1): number
   {
      if (maxValue > 1) {
         throw new Error(`maxValue must be less than or equal to 1`);
      } else if (minValue < -1) {
         throw new Error(`minValue must be greater or equal to negative one`);
      } else if (minValue > maxValue) {
         throw new Error(`minValue cannot be greater than maxValue`);
      }
      return ((maxValue - minValue) * Math.random()) - minValue;
   }

   public randomInt(maxValue: number = RandomGenerator.MAX_INT, minValue: number = 0): number
   {
      if (maxValue <= 1) {
         throw new Error(`maxValue must be greater than 1`);
      } else if (minValue > maxValue) {
         throw new Error(`minValue cannot be greater than maxValue`);
      }

      return Math.floor(((1 + maxValue - minValue) * Math.random()) - minValue);
   }

   public shuffle<T>(items: T[]): void
   {
      const itemCount: number = items.length;
      for (let ii = itemCount - 1; ii > 0; ii--) {
         const swapIndex = this.randomInt(ii);
         if (swapIndex < ii) {
            const swapItem = items[swapIndex];
            items[swapIndex] = items[ii];
            items[ii] = swapItem;
         }
      }
   }
}