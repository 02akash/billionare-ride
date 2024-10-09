import { SearchDocumentType } from '@wix/client-search-sdk';
import { CategoryList } from '@wix/search-settings-client';

export const getVisibleDocumentTypes = (
  availableDocumentTypes: SearchDocumentType[],
  categoryListSettings: CategoryList,
): SearchDocumentType[] => {
  return availableDocumentTypes
    .filter((documentType) => categoryListSettings[documentType].visible)
    .sort(
      (documentTypeA, documentTypeB) =>
        categoryListSettings[documentTypeA].index -
        categoryListSettings[documentTypeB].index,
    );
};
