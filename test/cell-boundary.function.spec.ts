import {getCellBoundaryGenerator} from '../src/minesweeper/mine-sweep/entity/cell-boundary.function';
import {fail} from 'assert';
import {expect} from 'chai';

describe('getCellBoundaryGenerator', () => {
   const sut = getCellBoundaryGenerator;

   it('rejects small x-dimension sizes', () => {
      try {
         sut(2, 100);
         fail('2 did not trigger an Error');
      } catch(e) { }
   });

   it('rejects small y-dimension sizes', () => {
      try {
         sut(100, 2);
         fail('2 did not trigger an Error');
      } catch(e) { }
   });

   it('Recognizes all four corners correctly', () => {
      it('handles the bottom-left', () => {
         const generator = sut(11, 11);
         const result = [... generator(0, 0)];
         expect(result)
            .to.be.an('array')
            .that.has.deep.members(
               [[0, 1], [1, 0], [1, 1]]
            );
      });
      it('handles the top-left', () => {
         const generator = sut(11, 11);
         const result = [... generator(0, 10)];
         expect(result)
            .to.be.an('array')
            .that.has.deep.members(
               [[1, 10], [0, 9], [1, 9]]
            );
      });
      it('handles the bottom-right', () => {
         const generator = sut(11, 11);
         const result = [... generator(10, 0)];
         expect(result)
            .to.be.an('array')
            .that.has.deep.members(
               [[9, 0], [10, 1], [9, 1]]
            );
      });
      it('handles the top-right', () => {
         const generator = sut(11, 11);
         const result = [... generator(10, 10)];
         expect(result)
            .to.be.an('array')
            .that.has.deep.members(
               [[9, 10], [10, 9], [9, 9]]
            );
      });
   });

   it('Recognizes points along any of four edges', () => {
      it('handles the left edge', () => {
         const generator = sut(11, 11);
         const result = [... generator(0, 5)];
         expect(result)
            .to.be.an('array')
            .that.has.deep.members(
               [[0, 6], [1, 6], [1, 5], [1, 4], [0, 4]]
            );
      });
      it('handles the top edge', () => {
         const generator = sut(11, 11);
         const result = [... generator(5, 10)];
         expect(result)
            .to.be.an('array')
            .that.has.deep.members(
               [[6, 10], [6, 9], [5, 9], [4, 9], [4, 10]]
            );
      });
      it('handles the right edge', () => {
         const generator = sut(11, 11);
         const result = [... generator(10, 5)];
         expect(result)
            .to.be.an('array')
            .that.has.deep.members(
               [[10, 6], [9, 6], [9, 5], [9, 4], [10, 4]]
            );
      });
      it('handles the bottom edge', () => {
         const generator = sut(11, 11);
         const result = [... generator(5, 0)];
         expect(result)
            .to.be.an('array')
            .that.has.deep.members(
               [[6, 0], [6, 1], [5, 1], [4, 1], [4, 0]]
            );
      });
   });

   it('handles points on the interior', () => {
      const generator = sut(11, 11);
      const result = [... generator(5, 5)];
      expect(result)
         .to.be.an('array')
         .that.has.deep.members([
            [5, 6], [6, 6], [6, 5], [6, 4], [5, 4], [4, 4], [4, 5], [4, 6]
         ]);
   });

   it('Is not fooled by near-edge or near-corner points', () => {
      const generator = sut(11, 11);
      const result = [... generator(9, 9)];
      expect(result)
         .to.be.an('array')
         .that.has.deep.members([
            [9, 10], [10, 10], [10, 9], [10, 8], [9, 8], [8, 8], [8, 9], [8, 10]
         ]);
   });

   it('Handles the smallest possible region', () => {
      const generator = sut(3, 3);
      const result = [... generator(1, 1)];
      expect(result)
         .to.be.an('array')
         .that.has.deep.members([
            [1, 2], [2, 2], [2, 1], [2, 0], [1, 0], [0, 0], [0, 1], [0, 2]
         ]);
   });

   it('Handles the smallest possible corner', () => {
      const generator = sut(3, 3);
      const result = [... generator(2, 0)];
      expect(result)
         .to.be.an('array')
         .that.has.deep.members([[1, 0], [1, 1], [2, 1]]);
   })

   it('Handles the smallest possible edge', () => {
      const generator = sut(3, 3);
      const result = [... generator(0, 1)];

      expect(result)
         .to.be.an('array')
         .that.has.deep.members([[0, 2], [1, 2], [1, 1], [1, 0], [0, 0]]);
   });

});
