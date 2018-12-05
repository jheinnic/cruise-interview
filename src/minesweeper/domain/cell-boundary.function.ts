export function getCellBoundaryGenerator(xSize: number, ySize: number):
   (xIndex: number, yIndex: number) => IterableIterator<[number, number]>
{
   const maxX = xSize - 1;
   const maxY = ySize - 1;

   function* yieldCorner(
      xIndex: number, yIndex: number, xDelta: number, yDelta: number): IterableIterator<[number, number]>
   {
      yield [xIndex + xDelta, yIndex];
      yield [xIndex + xDelta, yIndex + yDelta];
      yield [xIndex, yIndex + yDelta];
   }

   function* yieldVerticalEdge(xIndex: number, yIndex: number, xDelta: number): IterableIterator<[number, number]>
   {
      yield [xIndex, yIndex + 1];
      yield [xIndex + xDelta, yIndex + 1];
      yield [xIndex + xDelta, yIndex];
      yield [xIndex + xDelta, yIndex - 1];
      yield [xIndex, yIndex - 1];
   }

   function* yieldHorizontalEdge(xIndex: number, yIndex: number, yDelta: number): IterableIterator<[number, number]>
   {
      yield [xIndex + 1, yIndex];
      yield [xIndex + 1, yIndex + yDelta];
      yield [xIndex, yIndex + yDelta];
      yield [xIndex - 1, yIndex + yDelta];
      yield [xIndex - 1, yIndex];
   }

   function* cellBoundary(xIndex: number, yIndex: number): IterableIterator<[number, number]>
   {
      if (xIndex == 0) {
         if (yIndex == 0) {
            yield* yieldCorner(xIndex, yIndex, 1, 1);
         } else if (yIndex == maxY) {
            yield* yieldCorner(xIndex, yIndex, 1, -1);
         } else {
            yield* yieldVerticalEdge(xIndex, yIndex, 1);
         }
      } else if (xIndex == maxX) {
         if (yIndex == 0) {
            yield* yieldCorner(xIndex, yIndex, -1, 1);
         } else if (yIndex == maxY) {
            yield* yieldCorner(xIndex, yIndex, -1, -1);
         } else {
            yield* yieldVerticalEdge(xIndex, yIndex, -1);
         }
      } else {
         if (yIndex == 0) {
            yield* yieldHorizontalEdge(xIndex, yIndex, 1);
         } else if (yIndex == maxY) {
            yield* yieldHorizontalEdge(xIndex, yIndex, -1);
         } else {
            yield [xIndex + 1, yIndex + 1];
            yield [xIndex, yIndex + 1];
            yield [xIndex - 1, yIndex + 1];
            yield [xIndex - 1, yIndex];
            yield [xIndex - 1, yIndex - 1];
            yield [xIndex, yIndex - 1];
            yield [xIndex + 1, yIndex - 1];
            yield [xIndex + 1, yIndex];
         }
      }
   }

   return cellBoundary;
}