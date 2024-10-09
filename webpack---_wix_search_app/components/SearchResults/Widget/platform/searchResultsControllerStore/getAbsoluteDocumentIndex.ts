import { ISearchRequestPaging } from '@wix/client-search-sdk';

export function getAbsoluteDocumentIndex(
  paging: ISearchRequestPaging,
  indexOnCurrentPage: number,
): number {
  if (indexOnCurrentPage < 0) {
    return indexOnCurrentPage;
  }
  const { page, pageSize } = paging;
  const numberOfPreviousResults = page > 1 ? (page - 1) * pageSize : 0;
  return numberOfPreviousResults + indexOnCurrentPage;
}
