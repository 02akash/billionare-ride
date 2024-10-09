import { SearchDocumentType, ISearchResponse } from '@wix/client-search-sdk';
import { SearchParams } from './search';
import { WarmupDataKey } from './warmupDataKey';

type GetSearchResponseParams = Pick<
  SearchParams,
  | 'searchRequest'
  | 'searchSDK'
  | 'correlationId'
  | 'environment'
  | 'wixCodeApi'
  | 'useWarmupData'
> & {
  shouldShowSamples: boolean;
  warmupDataKey: WarmupDataKey;
};

export const getSearchResponse = async ({
  correlationId,
  environment,
  searchRequest,
  searchSDK,
  shouldShowSamples,
  useWarmupData,
  warmupDataKey,
  wixCodeApi,
}: GetSearchResponseParams) => {
  if (shouldShowSamples) {
    return Promise.resolve({
      documents: [],
      facets: [],
      documentType: SearchDocumentType.All,
      totalResults: 0,
    });
  }

  const { warmupData } = wixCodeApi.window;

  if (useWarmupData && !environment.isSSR) {
    const ssrSearchResponse = warmupData.get(warmupDataKey);

    if (ssrSearchResponse) {
      return ssrSearchResponse as ISearchResponse;
    }
  }

  const searchResponse = await searchSDK.search(searchRequest, {
    correlationId,
  });

  if (useWarmupData && environment.isSSR && !('isError' in searchResponse)) {
    warmupData.set(warmupDataKey, searchResponse);
  }

  return searchResponse;
};
