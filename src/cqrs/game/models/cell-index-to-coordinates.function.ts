export function getCellIndexToCoordinates(
   xSize: number, ySize: number):(index: number) => [number, number]
{
   function cellIndexToCoordinates(index: number): [number, number]
   {
      const yCoordinate = index % ySize;
      return [(index - yCoordinate) / xSize, yCoordinate];
   }

   return cellIndexToCoordinates;
}
