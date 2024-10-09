import { IWixAPI, ILocation } from '@wix/yoshi-flow-editor';

import { ISearchLocation, ILocationSearchRequest } from './location.types';
import { decodeParams, decodeParamsFromPath, encodeParams } from './params';
import { convertSearchRequestToSortOption } from '../../components/SearchResults/Widget/platform/sort';
import { DEFAULT_SEARCH_REQUEST } from './params/defaultSearchRequest';
import appConfig from '../../../.application.json';

const SEARCH_RESULTS_PAGE_ID = 'search_results';

export const toLocationSearchRequest: ISearchLocation['toLocationSearchRequest'] =
  (searchRequest, facetsFilters) => {
    const { documentType, query, paging } = searchRequest;
    const sort = convertSearchRequestToSortOption(searchRequest);

    return {
      documentType,
      query,
      page: paging.page,
      sort,
      facetsFilters,
    };
  };

const mergeUrl = (baseUrl: string, params: string): string => {
  return params === '' || params.startsWith('?')
    ? `${baseUrl}${params}`
    : `${baseUrl}/${params}`;
};

export const buildSearchResultsUrl = (
  baseResultsPageUrl: string,
  locationSearchRequest: ILocationSearchRequest,
  currentQuery: ILocation['query'],
) => {
  const params = encodeParams(locationSearchRequest, currentQuery);
  return mergeUrl(baseResultsPageUrl, params);
};

export const createSearchLocation = (wixCodeApi: IWixAPI): ISearchLocation => {
  function getSectionUrl() {
    return wixCodeApi.site.getSectionUrl({
      appDefinitionId: appConfig.appDefinitionId,
      sectionId: SEARCH_RESULTS_PAGE_ID,
    });
  }

  const searchLocation: ISearchLocation = {
    decodeParams() {
      return decodeParams(wixCodeApi.location);
    },

    decodeParamsFromPath() {
      return decodeParamsFromPath(wixCodeApi.location);
    },

    encodeParams(locationSearchRequest) {
      return encodeParams(locationSearchRequest, wixCodeApi.location.query);
    },

    async getSearchResultsRelativeUrl() {
      const { relativeUrl } = await getSectionUrl();
      if (typeof relativeUrl !== 'string') {
        throw new Error(
          'Unexpected value returned from wixCodeApi.site.getSectionUrl().',
        );
      }
      return relativeUrl;
    },

    async getSearchResultsAbsoluteUrl() {
      const { url } = await getSectionUrl();
      if (typeof url !== 'string') {
        throw new Error(
          'Unexpected value returned from wixCodeApi.site.getSectionUrl().',
        );
      }
      return url;
    },

    navigateTo(relativeUrl, { disableScrollToTop } = {}) {
      wixCodeApi.location.to?.(relativeUrl, { disableScrollToTop });
    },

    async navigateToSearchResults(
      locationSearchRequest,
      { disableScrollToTop } = {},
    ) {
      const relativeUrl = await searchLocation.getSearchResultsRelativeUrl();
      const params = searchLocation.encodeParams(locationSearchRequest);
      const url = mergeUrl(relativeUrl, params);

      wixCodeApi.location.to?.(url, { disableScrollToTop });
    },

    toLocationSearchRequest,

    toSDKSearchRequest({ page, documentType, query }, pageSize) {
      return {
        documentType,
        query: query || DEFAULT_SEARCH_REQUEST.query,
        paging: {
          page: page || DEFAULT_SEARCH_REQUEST.page,
          pageSize,
        },
      };
    },

    buildSearchResultsUrl(baseResultsPageUrl, locationSearchRequest) {
      return buildSearchResultsUrl(
        baseResultsPageUrl,
        locationSearchRequest,
        wixCodeApi.location.query,
      );
    },
  };

  return searchLocation;
};
