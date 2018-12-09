export interface IRandomGenerator {
   randomFloat(maxValue?: number, minValue?: number): number;

   randomInt(maxValue?: number, minValue?: number): number;

   shuffle<T>(items: ArrayLike<T>): void;
}