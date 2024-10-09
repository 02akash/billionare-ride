import { ClientSearchSDK } from '@wix/client-search-sdk';
import { AppSettings } from '@wix/search-settings-client';
import { Experiments } from '@wix/yoshi-flow-editor';
import { ISearchBoxWixCode } from '@wix/site-search-common';
import { ISearchLocation } from '../../../../lib/location';
import { ISearchPlatformBiLogger } from '../bi';
import { convertResponseToSuggestions } from './convertResponseToSuggestions';

type LoadSuggestionsParams = {
  searchLocation: ISearchLocation;
  searchSDK: ClientSearchSDK;
  biLogger: ISearchPlatformBiLogger;
  experiments: Experiments;
  isMobile: boolean;
  searchBox: ISearchBoxWixCode;
  appSettings: AppSettings;
};

export async function loadSuggestions({
  searchLocation,
  searchSDK,
  biLogger,
  experiments,
  isMobile,
  searchBox,
  appSettings,
}: LoadSuggestionsParams) {
  const searchQuery = searchBox.value.trim();

  if (isMobile) {
    searchBox.suggestionsLoading = true;
  }

  const federatedResponsePromise = searchSDK.getFederatedSuggestions(
    {
      query: searchQuery,
      limit: 4,
      includeSeoHidden: appSettings.isSeoHiddenIncluded,
    },
    { correlationId: biLogger.suggestionsCorrelationId },
  );

  const [federatedResponse, baseResultsPageUrl] = await Promise.all([
    federatedResponsePromise,
    searchLocation.getSearchResultsAbsoluteUrl(),
  ]);

  const footerUrl = searchLocation.buildSearchResultsUrl(baseResultsPageUrl, {
    query: searchQuery,
  });

  const federatedSuggestions = convertResponseToSuggestions({
    baseResultsPageUrl,
    appSettings,
    federatedResponse,
    footerUrl,
    searchLocation,
    searchQuery,
    experiments,
  });

  if (searchQuery === searchBox.value.trim()) {
    searchBox.suggestions = federatedSuggestions;
    return federatedSuggestions;
  }
}
