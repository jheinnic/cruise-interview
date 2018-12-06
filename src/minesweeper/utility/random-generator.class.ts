import {IRandomGenerator} from './random-generator.interface';
import {Injectable} from '@nestjs/common';

@Injectable()
export class RandomGenerator implements IRandomGenerator {
   public randomFloat(maxValue: number = 1, minValue: number = (maxValue - 1)): number
   {
      return ((maxValue - minValue) * Math.random()) - minValue;
   }

   public randomInt(maxValue: number, minValue?: number): number
   {
      if (minValue == undefined) {
         if (maxValue < 0) {
            minValue = maxValue;
            maxValue = 0;
         } else if (maxValue == 0) {
            return 0;
         } else {
            minValue = 0;
         }
      } else if (minValue == maxValue) {
         return minValue;
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