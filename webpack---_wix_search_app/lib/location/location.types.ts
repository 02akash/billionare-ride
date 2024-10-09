import { SearchDocumentType, ISearchRequest } from '@wix/client-search-sdk';
import { FacetFilterValue } from '../../integrations';
import { SortOption } from '../sort';

// Old path params for backwards compatibility and to support redirects
export enum SearchPathParam {
  Query = 'q',
  DocumentType = 'qc',
  Page = 'page',
}

// NOTE: Order of enum values here will define query param ordering in the URL
export enum SearchQueryParam {
  Query = 'q',
  DocumentType = 'type',
  Page = 'page',
  Sort = 'sort',
}

export interface ILocationSearchRequest {
  query?: string;
  documentType?: SearchDocumentType;
  page?: number;
  sort?: SortOption;
  facetsFilters?: FacetFilterValue;
}

export type IEncodedSearchPathParams = {
  [key in SearchPathParam]?: string;
};

export type IEncodedSearchQueryParams = {
  [key in SearchQueryParam]?: string;
};

interface NavigateOptions {
  disableScrollToTop?: boolean;
}

export interface ISearchLocation {
  decodeParams(): ILocationSearchRequest;
  decodeParamsFromPath(): ILocationSearchRequest;
  encodeParams(locationSearchRequest: ILocationSearchRequest): string;

  navigateTo(url: string, options?: NavigateOptions): void;

  navigateToSearchResults(
    locationSearchRequest: ILocationSearchRequest,
    options?: NavigateOptions,
  ): Promise<void>;

  getSearchResultsRelativeUrl(): Promise<string>;
  getSearchResultsAbsoluteUrl(): Promise<string>;

  toSDKSearchRequest(
    locationSearchRequest: ILocationSearchRequest,
    pageSize: number,
  ): ISearchRequest;

  toLocationSearchRequest(
    searchRequest: ISearchRequest,
    facetFilters: FacetFilterValue,
  ): ILocationSearchRequest;

  buildSearchResultsUrl(
    baseResultsPageUrl: string,
    locationSearchRequest: ILocationSearchRequest,
  ): string;
}
