import {
  ClientSearchSDK,
  IErrorResponse,
  ISampleResponse,
  ISearchRequest,
  ISearchResponse,
  ISearchResponseTotals,
  SearchDocumentType,
} from '@wix/client-search-sdk';
import { ControllerFlowAPI, IWixAPI } from '@wix/yoshi-flow-editor';

import { SearchRequestBiLogger } from '../bi';
import { getSearchResponse } from './getSearchResponse';
import { getDocumentIds } from './getDocumentIds';
import { SessionStore, SessionStoreKey } from '../../../../../lib/sessionStore';
import { WarmupDataKey } from './warmupDataKey';
import { SearchRequestStatus } from '../../types/types';
import { getFacetsResponse } from './getFacetsResponse';
import {
  convertFacetFilterToSearchResponseFacets as convertFacetOptionValuesToSearchResponseFacets,
  extractFacetsFromSearchResponse,
} from '../facets';
import {
  availableFacets,
  FacetOptionsValue,
} from '../../../../../integrations';
import { FacetDescriptor } from '../../../../../types/core/facets';

export type SearchParams = {
  biLogger?: SearchRequestBiLogger;
  sessionStore: SessionStore;
  environment: ControllerFlowAPI['environment'];
  correlationId?: string;
  facetsEnabled?: boolean;
  searchRequest: ISearchRequest;
  searchSDK: ClientSearchSDK;
  useWarmupData: boolean;
  wixCodeApi: IWixAPI;
  federatedResponse: ISampleResponse;
  visibleDocumentTypes: SearchDocumentType[];
  searchResponseTotals: ISearchResponseTotals;
  previousSearchResponse: ISearchResponse;
  previousSearchRequest: ISearchRequest;
  previousSearchRequestStatus: SearchRequestStatus;
};

export const search = async (
  searchParams: SearchParams,
): Promise<{
  searchResponse: ISearchResponse | IErrorResponse;
}> => {
  const {
    biLogger,
    sessionStore,
    correlationId,
    facetsEnabled,
    searchSDK,
    wixCodeApi,
    useWarmupData,
    environment,
    federatedResponse,
    searchRequest,
    visibleDocumentTypes,
    searchResponseTotals,
  } = searchParams;

  try {
    const shouldShowSamples =
      !visibleDocumentTypes.length ||
      searchRequest.documentType === SearchDocumentType.All;

    const promises = facetsEnabled ? getFacetsResponse(searchParams) : [];

    const [searchResponse, ...facetResponses] = await Promise.all([
      getSearchResponse({
        searchRequest,
        shouldShowSamples,
        searchSDK,
        correlationId,
        wixCodeApi,
        environment,
        useWarmupData,
        warmupDataKey: WarmupDataKey.SearchResponse,
      }),
      ...promises,
    ]);

    const commonErrorResponse = {
      searchRequest,
      visibleDocumentTypes,
      searchResponseTotals,
      searchSamples: [],
    };

    if ('isError' in searchResponse) {
      return { ...commonErrorResponse, searchResponse };
    }

    const updatedFacets = facetResponses.reduce((reducedFacets, response) => {
      if (!response) {
        return reducedFacets;
      }
      if ('searchResponse' in reducedFacets) {
        return reducedFacets;
      }
      if ('isError' in response) {
        return {
          ...commonErrorResponse,
          searchResponse: response,
        };
      }

      const facetName = response.facetName as keyof FacetOptionsValue;
      const facets = extractFacetsFromSearchResponse(response);

      if (
        !(availableFacets[facetName] as FacetDescriptor)
          ?.refreshOnDependentFacetChange
      ) {
        return { ...reducedFacets, ...facets };
      }

      return { ...reducedFacets, [facetName]: facets[facetName] };
    }, extractFacetsFromSearchResponse(searchResponse) as FacetOptionsValue | (typeof commonErrorResponse & { searchResponse: IErrorResponse }));

    if ('searchResponse' in updatedFacets) {
      return updatedFacets;
    }

    searchResponse.facets =
      convertFacetOptionValuesToSearchResponseFacets(updatedFacets);

    if (shouldShowSamples) {
      searchResponse.totalResults =
        searchResponseTotals[SearchDocumentType.All] || 0;
    }

    biLogger?.finished(
      searchRequest,
      searchResponse,
      searchResponseTotals,
      getDocumentIds({
        searchResponse,
        federatedResponse,
        shouldShowSamples,
      }),
    );

    return {
      searchResponse,
    };
  } catch (error) {
    biLogger?.failed(searchRequest, error);
    throw error;
  } finally {
    sessionStore.remove(SessionStoreKey.BiSearchOrigin);
  }
};
