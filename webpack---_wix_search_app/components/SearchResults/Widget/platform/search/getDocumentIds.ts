import { ISampleResponse, ISearchResponse } from '@wix/client-search-sdk';

import { BiDocumentIds } from '../../../../SearchBox/platform/bi';

export function getDocumentIds({
  searchResponse,
  federatedResponse,
  shouldShowSamples,
}: {
  searchResponse: ISearchResponse;
  federatedResponse: ISampleResponse;
  shouldShowSamples: boolean;
}): BiDocumentIds {
  if (shouldShowSamples) {
    return federatedResponse.results.reduce((acc, curr) => {
      return { ...acc, [curr.documentType]: curr.documents.map((d) => d.id) };
    }, {});
  }
  return searchResponse.documents.reduce<BiDocumentIds>((acc, curr) => {
    if (!acc[curr.documentType]) {
      acc[curr.documentType] = [];
    }
    acc[curr.documentType].push(curr.id);
    return acc;
  }, {});
}
