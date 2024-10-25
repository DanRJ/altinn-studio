import { ArrayUtils } from './ArrayUtils';

describe('ArrayUtils', () => {
  describe('removeDuplicates', () => {
    it('Removes duplicates', () => {
      expect(ArrayUtils.removeDuplicates([1, 1, 2, 3, 3])).toEqual([1, 2, 3]);
      expect(ArrayUtils.removeDuplicates(['a', 'b', 'c', 'b'])).toEqual(['a', 'b', 'c']);
    });

    it('Returns equal array if there are no duplicates', () => {
      expect(ArrayUtils.removeDuplicates([1, 2, 3])).toEqual([1, 2, 3]);
      expect(ArrayUtils.removeDuplicates(['a', 'b', 'c'])).toEqual(['a', 'b', 'c']);
      expect(ArrayUtils.removeDuplicates([1, 2, 3, '3'])).toEqual([1, 2, 3, '3']);
    });

    it('Returns empty array if input is empty', () => {
      expect(ArrayUtils.removeDuplicates([])).toEqual([]);
    });
  });

  describe('getValidIndex', () => {
    it('Returns the given index if it is valid', () => {
      expect(ArrayUtils.getValidIndex([1, 2, 3], 0)).toEqual(0);
      expect(ArrayUtils.getValidIndex([1, 2, 3], 1)).toEqual(1);
      expect(ArrayUtils.getValidIndex([1, 2, 3], 2)).toEqual(2);
    });

    it('Returns the last index when the given index is too large', () => {
      expect(ArrayUtils.getValidIndex([1, 2, 3], 3)).toEqual(2);
      expect(ArrayUtils.getValidIndex([1, 2, 3], 4)).toEqual(2);
    });

    it('Returns the last index when the given index is negative', () => {
      expect(ArrayUtils.getValidIndex([1, 2, 3], -1)).toEqual(2);
      expect(ArrayUtils.getValidIndex([1, 2, 3], -2)).toEqual(2);
    });
  });

  describe('removeItemByValue', () => {
    it('Deletes item from array by value', () => {
      expect(ArrayUtils.removeItemByValue([1, 2, 3], 2)).toEqual([1, 3]);
      expect(ArrayUtils.removeItemByValue(['a', 'b', 'c'], 'b')).toEqual(['a', 'c']);
      expect(ArrayUtils.removeItemByValue(['a', 'b', 'c'], 'd')).toEqual(['a', 'b', 'c']);
      expect(ArrayUtils.removeItemByValue([], 'a')).toEqual([]);
      expect(ArrayUtils.removeItemByValue(['a', 'b', 'c', 'b', 'a'], 'b')).toEqual(['a', 'c', 'a']);
    });
  });

  describe('last', () => {
    it('Returns last item in array', () => {
      expect(ArrayUtils.last([1, 2, 3])).toEqual(3);
      expect(ArrayUtils.last(['a', 'b', 'c'])).toEqual('c');
    });

    it('Returns undefined if array is empty', () => {
      expect(ArrayUtils.last([])).toBeUndefined();
    });
  });

  describe('ArrayUtils.intersection', () => {
    it('Returns intersection of two arrays when included is true', () => {
      expect(ArrayUtils.intersection([1, 2, 3], [3, '4', 5])).toStrictEqual([3]);
      expect(ArrayUtils.intersection([1, 2, 3], [4, '4', 5])).toStrictEqual([]);
      expect(ArrayUtils.intersection([1, 2, 3], [3, '4', 2])).toStrictEqual([2, 3]);
      expect(ArrayUtils.intersection([1, 2, 3], [1, 2, 3])).toStrictEqual([1, 2, 3]);
    });

    it('Returns intersection of two arrays when included is false', () => {
      expect(ArrayUtils.intersection([1, 2, 3], [3, '4', 5], false)).toStrictEqual([1, 2]);
      expect(ArrayUtils.intersection([1, 2, 3], [4, '4', 5], false)).toStrictEqual([1, 2, 3]);
      expect(ArrayUtils.intersection([1, 2, 3], [3, '4', 2], false)).toStrictEqual([1]);
      expect(ArrayUtils.intersection([1, 2, 3], [1, 2, 3], false)).toStrictEqual([]);
    });
  });

  describe('replaceByIndex', () => {
    it('Replaces element in array with new value', () => {
      const array1 = ['0', '1', '2'];
      expect(ArrayUtils.replaceByIndex(array1, 0, '1')).toEqual(['1', '1', '2']);

      const array2 = [0, 1, 2];
      expect(ArrayUtils.replaceByIndex(array2, 1, 2)).toEqual([0, 2, 2]);

      const array3 = [true, false, true];
      expect(ArrayUtils.replaceByIndex(array3, 2, false)).toEqual([true, false, false]);
    });

    it('Returns initial array if index is invalid', () => {
      const array = [0, 1, 2];
      expect(ArrayUtils.replaceByIndex(array, 4, 2)).toEqual(array);
    });
  });

  describe('removeItemByIndex', () => {
    it('Deletes item from array by value', () => {
      expect(ArrayUtils.removeItemByIndex([1, 2, 3], 1)).toEqual([1, 3]);
      expect(ArrayUtils.removeItemByIndex(['a', 'b', 'c'], 1)).toEqual(['a', 'c']);
      expect(ArrayUtils.removeItemByIndex(['a', 'b', 'c'], 3)).toEqual(['a', 'b', 'c']);
      expect(ArrayUtils.removeItemByIndex([], 1)).toEqual([]);
    });
  });

  describe('getNonEmptyArrayOrUndefined', () => {
    it('Returns array if it is not empty', () => {
      expect(ArrayUtils.getNonEmptyArrayOrUndefined([1, 2, 3])).toEqual([1, 2, 3]);
      expect(ArrayUtils.getNonEmptyArrayOrUndefined(['a', 'b', 'c'])).toEqual(['a', 'b', 'c']);
    });

    it('Returns undefined if array is empty', () => {
      expect(ArrayUtils.getNonEmptyArrayOrUndefined([])).toBeUndefined();
    });
  });

  describe('prepend', () => {
    it('Prepends item to array', () => {
      expect(ArrayUtils.prepend([1, 2, 3], 0)).toEqual([0, 1, 2, 3]);
      expect(ArrayUtils.prepend(['a', 'b', 'c'], 'd')).toEqual(['d', 'a', 'b', 'c']);
    });
  });

  describe('replaceLastItem', () => {
    it('should replace the last item in an array and return the modified array', () => {
      expect(ArrayUtils.replaceLastItem([1, 2, 3], 99)).toEqual([1, 2, 99]);
    });

    it('should handle arrays with only one item', () => {
      expect(ArrayUtils.replaceLastItem([5], 42)).toEqual([42]);
    });

    it('should return an empty array when called on an empty array', () => {
      expect(ArrayUtils.replaceLastItem([], 10)).toEqual([]);
    });
  });

  describe('areItemsUnique', () => {
    it('Returns true if all items are unique', () => {
      expect(ArrayUtils.areItemsUnique([1, 2, 3])).toBe(true);
      expect(ArrayUtils.areItemsUnique(['a', 'b', 'c'])).toBe(true);
      expect(ArrayUtils.areItemsUnique(['abc', 'bcd', 'cde'])).toBe(true);
      expect(ArrayUtils.areItemsUnique([true, false])).toBe(true);
      expect(ArrayUtils.areItemsUnique([1, 'b', true])).toBe(true);
      expect(ArrayUtils.areItemsUnique([0, '', false, null, undefined])).toBe(true);
    });

    it('Returns true if array is empty', () => {
      expect(ArrayUtils.areItemsUnique([])).toBe(true);
    });

    it('Returns false if there is at least one duplicated item', () => {
      expect(ArrayUtils.areItemsUnique([1, 2, 1])).toBe(false);
      expect(ArrayUtils.areItemsUnique(['a', 'a', 'c'])).toBe(false);
      expect(ArrayUtils.areItemsUnique(['abc', 'bcd', 'bcd'])).toBe(false);
      expect(ArrayUtils.areItemsUnique([true, false, true])).toBe(false);
      expect(ArrayUtils.areItemsUnique([1, 'b', false, 1])).toBe(false);
      expect(ArrayUtils.areItemsUnique([null, null])).toBe(false);
      expect(ArrayUtils.areItemsUnique([undefined, undefined])).toBe(false);
    });
  });

  describe('swapArrayElements', () => {
    it('Swaps two elements in an array', () => {
      const arr: string[] = ['a', 'b', 'c', 'd', 'e', 'f'];
      expect(ArrayUtils.swapArrayElements(arr, 'a', 'b')).toEqual(['b', 'a', 'c', 'd', 'e', 'f']);
    });
  });

  describe('insertArrayElementAtPos', () => {
    const arr = ['a', 'b', 'c'];

    it('Inserts element at given position', () => {
      expect(ArrayUtils.insertArrayElementAtPos(arr, 'M', 0)).toEqual(['M', 'a', 'b', 'c']);
      expect(ArrayUtils.insertArrayElementAtPos(arr, 'M', 1)).toEqual(['a', 'M', 'b', 'c']);
      expect(ArrayUtils.insertArrayElementAtPos(arr, 'M', 3)).toEqual(['a', 'b', 'c', 'M']);
    });

    it('Inserts element at the end if the position number is too large', () => {
      expect(ArrayUtils.insertArrayElementAtPos(arr, 'M', 9)).toEqual(['a', 'b', 'c', 'M']);
    });

    it('Inserts element at the end if the position number is negative', () => {
      expect(ArrayUtils.insertArrayElementAtPos(arr, 'M', -1)).toEqual(['a', 'b', 'c', 'M']);
    });
  });

  describe('mapByKey', () => {
    it('Returns an array of values mapped by the given key', () => {
      const array = [
        { a: 1, b: 2 },
        { a: 2, b: 'c' },
        { a: 3, b: true, c: 'abc' },
      ];
      expect(ArrayUtils.mapByKey(array, 'a')).toEqual([1, 2, 3]);
    });
  });

  describe('replaceByPredicate', () => {
    it('Replaces the first item matching the predicate with the given item', () => {
      const array = ['test1', 'test2', 'test3'];
      const predicate = (item: string) => item === 'test2';
      const replaceWith = 'test4';
      expect(ArrayUtils.replaceByPredicate(array, predicate, replaceWith)).toEqual([
        'test1',
        'test4',
        'test3',
      ]);
    });
  });

  describe('rplaceItemsByValue', () => {
    it('Replaces all items matching the given value with the given replacement', () => {
      const array = ['a', 'b', 'c'];
      expect(ArrayUtils.replaceItemsByValue(array, 'b', 'd')).toEqual(['a', 'd', 'c']);
    });
  });

  describe('moveArrayItem', () => {
    it('Moves the item at the given index to the given position when the new position is BEFORE', () => {
      const array = ['a', 'b', 'c', 'd', 'e', 'f'];
      expect(ArrayUtils.moveArrayItem(array, 4, 1)).toEqual(['a', 'e', 'b', 'c', 'd', 'f']);
    });

    it('Moves the item at the given index to the given position when the new position is after', () => {
      const array = ['a', 'b', 'c', 'd', 'e', 'f'];
      expect(ArrayUtils.moveArrayItem(array, 1, 4)).toEqual(['a', 'c', 'd', 'e', 'b', 'f']);
    });

    it('Keeps the array unchanged if the two indices are the same', () => {
      const array = ['a', 'b', 'c', 'd', 'e', 'f'];
      expect(ArrayUtils.moveArrayItem(array, 1, 1)).toEqual(array);
    });
  });

  describe('generateUniqueStringWithNumber', () => {
    it('Returns prefix + 0 when the array is empty', () => {
      expect(ArrayUtils.generateUniqueStringWithNumber([], 'prefix')).toBe('prefix0');
    });

    it('Returns prefix + 0 when the array does not contain this value already', () => {
      const array = ['something', 'something else'];
      expect(ArrayUtils.generateUniqueStringWithNumber(array, 'prefix')).toBe('prefix0');
    });

    it('Returns prefix + number based on the existing values', () => {
      const array = ['prefix0', 'prefix1', 'prefix2'];
      expect(ArrayUtils.generateUniqueStringWithNumber(array, 'prefix')).toBe('prefix3');
    });

    it('Returns number only when the prefix is empty', () => {
      const array = ['0', '1', '2'];
      expect(ArrayUtils.generateUniqueStringWithNumber(array)).toBe('3');
    });
  });

  describe('removeEmptyStrings', () => {
    it('Removes empty strings from an array', () => {
      const array = ['0', '1', '', '2', ''];
      expect(ArrayUtils.removeEmptyStrings(array)).toEqual(['0', '1', '2']);
    });
  });
});
