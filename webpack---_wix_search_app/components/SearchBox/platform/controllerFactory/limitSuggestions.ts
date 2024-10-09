import { FederatedSuggestionsResponse } from '@wix/client-search-sdk';
import { cloneDeep } from 'lodash';

type Groups = FederatedSuggestionsResponse['results'];

export const limitSuggestions =
  (oneGroupMax: number, multipleGroupsMax: number) =>
  (
    groups: Groups,
    group: Groups[number],
    _: number,
    allGroups: Groups,
  ): Groups => {
    const newGroup = cloneDeep(group);
    newGroup.documents = newGroup.documents.slice(
      0,
      allGroups.length === 1 ? oneGroupMax : multipleGroupsMax,
    );
    groups.push(newGroup);
    return groups;
  };
