import { ControllerFlowAPI } from '@wix/yoshi-flow-editor';
import { FederatedSuggestions } from '@wix/site-search-common';
import {
  createDocumentItem,
  createGroupItem,
  SuggestionsParams,
} from './convertResponseToSuggestions';
import { limitSuggestions } from './limitSuggestions';
import { getSortedVisibleGroups } from './utils';

type TFunction = ControllerFlowAPI['translations']['t'];

const MAX_TRENDING = 4;
const MAX_TRENDING_IN_GROUP = 2;
const MAX_TRENDING_GROUPS = 1;

export const convertResponseToTrendingItems = ({
  federatedResponse,
  appSettings,
  searchQuery,
  searchLocation,
  translate,
  experiments,
}: Omit<SuggestionsParams, 'footerUrl' | 'baseResultsPageUrl'> & {
  translate: TFunction;
}): FederatedSuggestions => {
  const { results: groups } = federatedResponse;

  let globalIndex = 0;
  const sortedItems = getSortedVisibleGroups(groups, appSettings, experiments);
  const items = sortedItems
    .slice(0, MAX_TRENDING_GROUPS)
    .reduce(limitSuggestions(MAX_TRENDING, MAX_TRENDING_IN_GROUP), [])
    .map((group) => {
      const { useOverride, override } =
        appSettings.categoryList[group.documentType];

      const title =
        useOverride && override
          ? translate('searchBox.suggestions.trending', {
              title: override,
            })
          : group.title;
      return {
        ...group,
        title,
      };
    })
    .reduce<FederatedSuggestions['items']>(
      (result, group) => [
        ...result,
        createGroupItem({
          ...group,
          searchLocation,
          searchQuery,
        }),
        ...group.documents.map((document) =>
          createDocumentItem({
            document,
            searchQuery,
            globalIndex: globalIndex++,
            appSettings,
          }),
        ),
      ],
      [],
    );

  return { items };
};
