export function getCellIndexToCoordinates(
   xSize: number, ySize: number):(index: number) => [number, number]
{
   console.log("xSize = ", xSize, "; ySize = ", ySize);
   function cellIndexToCoordinates(index: number): [number, number]
   {
      const yCoordinate = index % ySize;
      console.log("For index = ", index, "x = ", ((index - yCoordinate) / ySize), ", and y = ", yCoordinate);
      return [(index - yCoordinate) / ySize, yCoordinate];
   }

   return cellIndexToCoordinates;
}
