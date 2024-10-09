import { SuggestionItem } from '@wix/site-search-common';
import { BiDocumentIds, SuggestionItems } from '../types';

export function getSuggestionsStats(suggestions: SuggestionItems) {
  const suggestionItems = suggestions.filter(
    (suggestion) => suggestion.type === 'item',
  ) as SuggestionItem[];
  const resultCount = suggestionItems.length;

  const stats = suggestionItems.reduce<Record<string, number>>(
    (result, suggestion) => {
      const { groupId } = suggestion.data!;
      return {
        ...result,
        [groupId]: (result[groupId] ?? 0) + 1,
      };
    },
    {},
  );

  const documentIds = suggestionItems.reduce<BiDocumentIds>(
    (result, suggestion) => {
      const { groupId } = suggestion.data!;
      return {
        ...result,
        [groupId]: (result[groupId] ?? []).concat(suggestion.id),
      };
    },
    {},
  );

  return {
    documentIds: JSON.stringify(documentIds),
    resultCount,
    resultsArray: JSON.stringify(stats),
    stats,
  };
}
