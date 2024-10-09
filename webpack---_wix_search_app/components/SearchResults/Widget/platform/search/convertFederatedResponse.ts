import { ISampleResponse, SearchDocumentType } from '@wix/client-search-sdk';
import { ISearchLocation } from '../../../../../lib/location';
import { ISearchSample } from '../searchResultsControllerStore';

type FederatedResponseConverter = {
  federatedResponse: ISampleResponse;
  searchLocation: ISearchLocation;
  searchResultsAbsoluteUrl: string;
  visibleDocumentTypes: SearchDocumentType[];
  query: string;
};

export function convertFederatedResponse({
  federatedResponse,
  query,
  searchLocation,
  searchResultsAbsoluteUrl,
  visibleDocumentTypes,
}: FederatedResponseConverter): ISearchSample[] {
  return federatedResponse.results
    .map((searchSample) => ({
      ...searchSample,
      url: searchLocation.buildSearchResultsUrl(searchResultsAbsoluteUrl, {
        query,
        documentType: searchSample.documentType,
      }),
    }))
    .sort(
      (searchSampleA, searchSampleB) =>
        visibleDocumentTypes.indexOf(searchSampleA.documentType) -
        visibleDocumentTypes.indexOf(searchSampleB.documentType),
    );
}
