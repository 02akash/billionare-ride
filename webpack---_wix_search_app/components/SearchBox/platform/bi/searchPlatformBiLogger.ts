import { VisitorLogger, IPlatformAPI } from '@wix/yoshi-flow-editor';
import { SearchDocumentType } from '@wix/client-search-sdk';
import {
  searchBoxSearchSubmit,
  searchBoxSuggestionsRequestFinished,
  searchBoxSuggestionClick,
  searchBoxSuggestionShowAllClick,
  searchBoxFocused,
  searchBoxStartedWritingAQuery,
  searchBoxCleared,
  searchBoxAutoCompleteShown,
  searchBoxAutoCompleteShownSuggestionApproved,
} from '@wix/bi-logger-wix-search-platform/v2';

import { BiSearchOrigin, createBiCorrelationId } from '../../../../lib/bi';
import { SuggestionItems } from './types';
import { getSuggestionsStats } from './getSuggestionsStats';
import { SessionStore, SessionStoreKey } from '../../../../lib/sessionStore';

type SuggestionsType = 'suggestions' | 'trending';

type SuggestionsRequestStartedParams = {
  searchQuery: string;
  correlationId: string;
  type: SuggestionsType;
};

type SuggestionClickParams = {
  title: string;
  url: string;
  searchQuery: string;
  index: number;
  documentType: string;
  suggestions: SuggestionItems;
  type: SuggestionsType;
};

const correlationIdTimeoutInMilliseconds = 30 * 1000;

export type ISearchPlatformBiLogger = ReturnType<
  typeof createSearchPlatformBiLogger
>;

export function createSearchPlatformBiLogger(
  platformAPIs: IPlatformAPI,
  bi: VisitorLogger,
) {
  const sessionStore = new SessionStore(platformAPIs);

  let trendingItemsCorrelationId: string | undefined;
  let correlationIdLastUsedAt: number | undefined;
  let lastSuggestions: SuggestionItems | undefined;
  const shouldGenerateNewCorrelationId: () => boolean = () => {
    return (
      !correlationIdLastUsedAt ||
      Date.now() - correlationIdLastUsedAt > correlationIdTimeoutInMilliseconds
    );
  };

  const generateCorrelationIdIfNeeded = () => {
    if (shouldGenerateNewCorrelationId()) {
      const correlationId = createBiCorrelationId();
      sessionStore.set(SessionStoreKey.BiSuggestionsCorrelation, correlationId);
      sessionStore.set(SessionStoreKey.BiSearchCorrelation, correlationId);
    }
    correlationIdLastUsedAt = Date.now();
  };

  const suggestionsRequestStarted = ({
    searchQuery,
    correlationId,
    type,
  }: SuggestionsRequestStartedParams) => {
    const startTime = Date.now();

    const commonProps = {
      correlationId,
      target: searchQuery,
      type,
    };

    return (finishParams: {
      success: boolean;
      error?: string;
      suggestions: SuggestionItems;
    }) => {
      const loadingDuration = Date.now() - startTime;

      if (finishParams.success) {
        lastSuggestions = finishParams.suggestions;
        const { resultCount, resultsArray, documentIds } = getSuggestionsStats(
          finishParams.suggestions,
        );

        bi.report(
          searchBoxSuggestionsRequestFinished({
            ...commonProps,
            documentIds,
            loadingDuration,
            resultCount,
            resultsArray,
            success: true,
          }),
        );
      } else {
        lastSuggestions = undefined;
        bi.report(
          searchBoxSuggestionsRequestFinished({
            ...commonProps,
            error: finishParams.error,
            loadingDuration,
            success: false,
          }),
        );
      }
    };
  };

  const suggestionClick = (params: SuggestionClickParams) => {
    const { resultsArray } = getSuggestionsStats(params.suggestions);
    const correlationId = sessionStore.get(
      SessionStoreKey.BiSuggestionsCorrelation,
    );

    const clickedSuggestion = params.suggestions.find(
      ({ url }) => url === params.url,
    );

    bi.report(
      searchBoxSuggestionClick({
        correlationId,
        documentId: clickedSuggestion?.id,
        documentType: params.documentType,
        pageUrl: params.url,
        resultsArray,
        searchIndex: params.index,
        target: params.searchQuery,
        resultClicked: params.title,
        type: params.type,
      }),
    );
  };

  const biLogger = {
    get searchCorrelationId() {
      generateCorrelationIdIfNeeded();
      return sessionStore.get(SessionStoreKey.BiSearchCorrelation);
    },
    get suggestionsCorrelationId() {
      generateCorrelationIdIfNeeded();
      return sessionStore.get(SessionStoreKey.BiSuggestionsCorrelation);
    },
    get trendingItemsCorrelationId(): string {
      // Trending items have special correlation ID handling where old correlation is reused
      // for a while even when search box value is cleared.
      return trendingItemsCorrelationId || biLogger.suggestionsCorrelationId;
    },
    set trendingItemsCorrelationId(value: string | undefined) {
      if (!trendingItemsCorrelationId || value === undefined) {
        trendingItemsCorrelationId = value;
      }
    },
    searchSubmit: (params: { isDemoContent: boolean; searchQuery: string }) => {
      generateCorrelationIdIfNeeded();

      sessionStore.set(
        SessionStoreKey.BiSearchOrigin,
        BiSearchOrigin.EditorSearchBar,
      );

      bi.report(
        searchBoxSearchSubmit({
          correlationId: sessionStore.get(SessionStoreKey.BiSearchCorrelation),
          isDemo: params.isDemoContent,
          target: params.searchQuery,
        }),
      );
    },

    resetCorrelationId: () => {
      correlationIdLastUsedAt = undefined;
    },

    searchBoxSuggestionsRequestStarted: (
      params: Omit<SuggestionsRequestStartedParams, 'type' | 'correlationId'>,
    ) =>
      suggestionsRequestStarted({
        ...params,
        type: 'suggestions',
        correlationId: biLogger.suggestionsCorrelationId,
      }),

    searchBoxTrendingItemsRequestStarted: () =>
      suggestionsRequestStarted({
        type: 'trending',
        searchQuery: '',
        correlationId: biLogger.trendingItemsCorrelationId,
      }),

    searchBoxSuggestionClick: (params: Omit<SuggestionClickParams, 'type'>) =>
      suggestionClick({ ...params, type: 'suggestions' }),

    searchBoxTrendingItemClick: (params: Omit<SuggestionClickParams, 'type'>) =>
      suggestionClick({ ...params, type: 'trending' }),

    searchBoxSuggestionSearchAllClick: (params: { searchQuery: string }) => {
      sessionStore.set(
        SessionStoreKey.BiSearchOrigin,
        BiSearchOrigin.EditorSearchBar,
      );
      bi.report(
        searchBoxSuggestionShowAllClick({
          correlationId: sessionStore.get(
            SessionStoreKey.BiSuggestionsCorrelation,
          ),
          // NOTE: what to do if there is only one tab? (so no All tab)
          documentType: SearchDocumentType.All,
          target: params.searchQuery,
        }),
      );
    },

    searchBoxSuggestionShowAllClick: (params: {
      searchQuery: string;
      documentType: string;
    }) => {
      sessionStore.set(
        SessionStoreKey.BiSearchOrigin,
        BiSearchOrigin.EditorSearchBar,
      );
      bi.report(
        searchBoxSuggestionShowAllClick({
          correlationId: sessionStore.get(
            SessionStoreKey.BiSuggestionsCorrelation,
          ),
          documentType: params.documentType,
          target: params.searchQuery,
        }),
      );
    },
    searchBoxFocused: (params: { isDemo: boolean; isFullscreen: boolean }) => {
      bi.report(
        searchBoxFocused({
          isDemo: params.isDemo,
          isFullscreen: params.isFullscreen,
        }),
      );
    },
    searchBoxStartedWritingAQuery: (params: { isDemo: boolean }) => {
      bi.report(
        searchBoxStartedWritingAQuery({
          isDemo: params.isDemo,
        }),
      );
    },
    searchBoxCleared: (params: { isDemo: boolean; searchQuery: string }) => {
      const { resultsArray } = getSuggestionsStats(lastSuggestions || []);
      bi.report(
        searchBoxCleared({
          correlationId: sessionStore.get(
            SessionStoreKey.BiSuggestionsCorrelation,
          ),
          isDemo: params.isDemo,
          target: params.searchQuery,
          resultsArray,
        }),
      );
    },
    searchBoxAutoCompleteShown: (params: {
      autocompleteValue: string;
      searchQuery: string;
    }) => {
      generateCorrelationIdIfNeeded();
      bi.report(
        searchBoxAutoCompleteShown({
          correlationId: sessionStore.get(
            SessionStoreKey.BiSuggestionsCorrelation,
          ),
          target: params.searchQuery,
          suggestion: params.autocompleteValue,
        }),
      );
    },
    searchBoxAutoCompleteShownSuggestionApproved: (params: {
      previousQuery: string;
      searchQuery: string;
    }) => {
      generateCorrelationIdIfNeeded();
      bi.report(
        searchBoxAutoCompleteShownSuggestionApproved({
          correlationId: sessionStore.get(
            SessionStoreKey.BiSuggestionsCorrelation,
          ),
          target: params.searchQuery,
          previousTarget: params.previousQuery,
        }),
      );
    },
  };

  return biLogger;
}
