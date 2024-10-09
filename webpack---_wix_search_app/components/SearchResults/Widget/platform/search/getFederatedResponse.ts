import { ISampleResponse } from '@wix/client-search-sdk';
import { SearchParams } from './search';
import { WarmupDataKey } from './warmupDataKey';

const LIMIT_MOBILE = 4;
const LIMIT_DESKTOP = 3;

type FederatedResponseParams = Pick<
  SearchParams,
  | 'searchRequest'
  | 'searchSDK'
  | 'environment'
  | 'correlationId'
  | 'wixCodeApi'
  | 'useWarmupData'
>;

export const getFederatedResponse = async ({
  searchRequest,
  searchSDK,
  environment,
  correlationId,
  wixCodeApi,
  useWarmupData,
}: FederatedResponseParams) => {
  const { warmupData } = wixCodeApi.window;

  if (useWarmupData && !environment.isSSR) {
    const ssrSamplesResponse = warmupData.get(WarmupDataKey.SamplesResponse);

    if (ssrSamplesResponse) {
      return ssrSamplesResponse as ISampleResponse;
    }
  }

  const limit =
    environment.isMobile && !environment.isEditorX
      ? LIMIT_MOBILE
      : LIMIT_DESKTOP;

  const samplesResponse = await searchSDK.getSample(
    {
      query: searchRequest.query,
      limit,
      includeSeoHidden: searchRequest.includeSeoHidden,
    },
    { correlationId },
  );

  if (useWarmupData && environment.isSSR && !('isError' in samplesResponse)) {
    warmupData.set(WarmupDataKey.SamplesResponse, samplesResponse);
  }

  return samplesResponse;
};
