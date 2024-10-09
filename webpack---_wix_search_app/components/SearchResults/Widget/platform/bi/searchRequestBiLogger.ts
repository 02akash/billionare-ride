import { VisitorLogger } from '@wix/yoshi-flow-editor';
import { searchRequestFinished } from '@wix/bi-logger-wix-search-widget/v2';
import { searchRequestFinishedParams as BiSearchRequestFinishedParams } from '@wix/bi-logger-wix-search-widget/v2/types';
import {
  ISearchRequest,
  ISearchResponse,
  ISearchResponseTotals,
} from '@wix/client-search-sdk';

import {
  getBiAvailableFacets,
  getBiSelectedFacets,
  getBiTotals,
} from './utils';

type SearchRequestBiLoggerParams = {
  bi: VisitorLogger;
  correlationId?: string;
  origin: string;
  isDemoContent: boolean;
};

export type SearchRequestBiLogger = ReturnType<
  typeof createSearchRequestBiLogger
>;

export const createSearchRequestBiLogger = ({
  bi,
  correlationId,
  origin,
  isDemoContent,
}: SearchRequestBiLoggerParams) => {
  const startTime = Date.now();

  const logSearchRequestFinished = (
    searchRequest: ISearchRequest,
    params: Partial<BiSearchRequestFinishedParams>,
  ) => {
    // 99:304 SearchResults - request result was received
    // https://bo.wix.com/bi-catalog-webapp/#/sources/99/events/304?artifactId=com.wixpress.wix-search-widget
    bi.report(
      searchRequestFinished({
        ...params,
        correlationId,
        documentType: searchRequest.documentType,
        isDemo: isDemoContent,
        orderingDirection: searchRequest.ordering?.ordering?.[0]?.direction,
        orderingFieldName: searchRequest.ordering?.ordering?.[0]?.fieldName,
        target: searchRequest.query,
        loadingDuration: Date.now() - startTime,
        origin,
      }),
    );
  };

  return {
    finished(
      searchRequest: ISearchRequest,
      searchResponse: ISearchResponse,
      searchResponseTotals: ISearchResponseTotals,
      documentIds: unknown,
    ) {
      logSearchRequestFinished(searchRequest, {
        documentIds: JSON.stringify(documentIds),
        availableFacets: getBiAvailableFacets(searchRequest, searchResponse),
        selectedFacets: getBiSelectedFacets(searchRequest),
        resultCount: searchResponse.totalResults,
        resultsArray: getBiTotals(searchResponseTotals),
        success: true,
      });
    },
    failed(searchRequest: ISearchRequest, error: unknown) {
      logSearchRequestFinished(searchRequest, {
        error: String(error),
        success: false,
      });
    },
  };
};
