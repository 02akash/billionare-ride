import { SearchDocumentType } from '@wix/client-search-sdk';

export const DEFAULT_SEARCH_REQUEST = {
  documentType: SearchDocumentType.All,
  query: '',
  page: 1,
};
