import { isEqual } from 'lodash';

import { ISearchRequest } from '@wix/client-search-sdk';

export function equalSearchRequests(
  searchRequest1: ISearchRequest,
  searchRequest2: ISearchRequest,
) {
  return isEqual(searchRequest1, searchRequest2);
}
