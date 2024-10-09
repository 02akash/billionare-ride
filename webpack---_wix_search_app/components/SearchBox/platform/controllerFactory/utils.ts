import { SuggestionsResult } from '@wix/client-search-sdk';
import { AppSettings } from '@wix/search-settings-client';
import { Experiments } from '@wix/yoshi-flow-editor';

import { getVisibleDocumentTypes } from '../../../../lib/documentTypes';

export const getSortedVisibleGroups = (
  groups: SuggestionsResult[],
  { categoryList }: AppSettings,
  experiments: Experiments,
) => {
  const availableDocumentTypes = groups
    .filter(({ documents }) => !!documents.length)
    .map(({ documentType }) => documentType);

  const visibleDocumentTypes = getVisibleDocumentTypes(
    availableDocumentTypes,
    categoryList,
  );

  return groups
    .filter(({ documentType }) => visibleDocumentTypes.includes(documentType))
    .sort(
      (groupA, groupB) =>
        visibleDocumentTypes.indexOf(groupA.documentType) -
        visibleDocumentTypes.indexOf(groupB.documentType),
    );
};
