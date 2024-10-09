import { SortOption, DEFAULT_SORT_OPTION } from '../../../sort';

const sortDecodingMap: Record<string, SortOption | undefined> = Object.values(
  SortOption,
).reduce(
  (result, sortOption) => ({
    ...result,
    [sortOption]: sortOption,
  }),
  {},
);

export function encodeSort(sort?: SortOption): string | undefined {
  return sort !== DEFAULT_SORT_OPTION ? sort : undefined;
}

export function decodeSort(encodedSort?: string): SortOption | undefined {
  return encodedSort ? sortDecodingMap[encodedSort] : undefined;
}
