import { ClientSearchSDK } from '@wix/client-search-sdk';
import { AppSettings } from '@wix/search-settings-client';
import { ISearchBoxWixCode } from '@wix/site-search-common';

import { ISearchPlatformBiLogger } from '../bi';

interface SuggestAutocompleteValueParams {
  searchBox: ISearchBoxWixCode;
  appSettings: AppSettings;
  searchSDK: ClientSearchSDK;
  biLogger: ISearchPlatformBiLogger;
}

export const suggestAutocompleteValue = async ({
  searchBox,
  appSettings,
  searchSDK,
  biLogger,
}: SuggestAutocompleteValueParams) => {
  const { value } = searchBox;
  const query = value.trim();

  if (!query.length) {
    searchBox.autocompleteValue = '';
    return;
  }

  const { isSeoHiddenIncluded, categoryList } = appSettings;
  const { results } = await searchSDK.getFederatedAutocomplete(
    {
      query,
      includeSeoHidden: isSeoHiddenIncluded,
    },
    { correlationId: biLogger.suggestionsCorrelationId },
  );

  // Ignore old out-of-band responses
  if (searchBox.value !== value) {
    return;
  }

  const [result] = results
    .filter(
      ({ documentType, values }) =>
        values.length > 0 && categoryList[documentType].visible,
    )
    .sort(
      (a, b) =>
        categoryList[a.documentType].index - categoryList[b.documentType].index,
    );

  const autocompleteValue = result?.values[0].query ?? '';

  searchBox.autocompleteValue = autocompleteValue;

  if (autocompleteValue) {
    biLogger.searchBoxAutoCompleteShown({
      autocompleteValue,
      searchQuery: value,
    });
  }
};
