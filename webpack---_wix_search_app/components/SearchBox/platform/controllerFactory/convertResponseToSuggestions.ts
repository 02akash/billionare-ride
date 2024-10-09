import { Experiments } from '@wix/yoshi-flow-editor';
import {
  ISearchDocument,
  IDocumentImage,
  SearchDocumentType,
  FederatedSuggestionsResponse,
} from '@wix/client-search-sdk';
import { AppSettings } from '@wix/search-settings-client';
import {
  ImageResizeMode,
  FederatedSuggestions,
  SuggestionGroup,
  SuggestionItem,
} from '@wix/site-search-common';

import { ISearchLocation } from '../../../../lib/location';
import { limitSuggestions } from './limitSuggestions';
import { getSortedVisibleGroups } from './utils';

export interface SuggestionsParams {
  federatedResponse: FederatedSuggestionsResponse;
  appSettings: AppSettings;
  searchQuery: string;
  footerUrl: string;
  searchLocation: ISearchLocation;
  baseResultsPageUrl: string;
  experiments: Experiments;
}

const MAX_SUGGESTION_DESCRIPTION_LENGTH = 200;
const MAX_SUGGESTIONS = 6;
const MAX_SUGGESTIONS_IN_GROUP = 3;

export const createGroupItem = ({
  documentType,
  title,
  searchLocation,
  baseResultsPageUrl,
  searchQuery,
}: {
  documentType: SearchDocumentType;
  title: string;
  searchLocation: ISearchLocation;
  baseResultsPageUrl?: string;
  searchQuery: string;
}): SuggestionGroup => {
  const url = baseResultsPageUrl
    ? searchLocation.buildSearchResultsUrl(baseResultsPageUrl, {
        documentType,
        query: searchQuery,
      })
    : undefined;

  return {
    type: 'group',
    url,
    title,
    link: {
      namespace: 'SearchResults',
      key: 'searchSuggestions.groupLinkText',
      default: 'Show all',
    },
    data: {
      groupId: documentType,
      query: searchQuery,
      url,
      type: 'group',
    },
  };
};

export const createDocumentItem = ({
  document,
  searchQuery,
  globalIndex,
  appSettings,
}: {
  document: ISearchDocument;
  searchQuery: string;
  globalIndex: number;
  appSettings: AppSettings;
}): SuggestionItem => {
  const imageResizeMode =
    document.documentType === SearchDocumentType.Products
      ? appSettings.productImageResizeMode
      : ImageResizeMode.Crop;

  return {
    id: document.id,
    type: 'item',
    url: document.url,
    title: document.title,
    description: document.description?.substring(
      0,
      MAX_SUGGESTION_DESCRIPTION_LENGTH,
    ),
    image: mapSuggestionItemImage(document.image, imageResizeMode),
    data: {
      globalIndex,
      groupId: document.documentType,
      query: searchQuery,
      url: document.url,
      type: 'item',
    },
  };
};

const mapSuggestionItemImage = (
  image: IDocumentImage,
  resizeMode: ImageResizeMode,
): SuggestionItem['image'] => {
  if (!image || !('name' in image)) {
    return;
  }

  return {
    ...image,
    resizeMode,
  };
};

export const convertResponseToSuggestions = ({
  federatedResponse,
  appSettings,
  searchQuery,
  footerUrl,
  searchLocation,
  baseResultsPageUrl,
  experiments,
}: SuggestionsParams): FederatedSuggestions => {
  const { results: groups } = federatedResponse;
  const { categoryList } = appSettings;
  let globalIndex = 0;

  const sortedItems = getSortedVisibleGroups(groups, appSettings, experiments);

  const items = sortedItems
    .map((group) => {
      const { useOverride, override } = categoryList[group.documentType];
      return {
        ...group,
        title: useOverride && override ? override : group.title,
      };
    })
    .reduce(limitSuggestions(MAX_SUGGESTIONS, MAX_SUGGESTIONS_IN_GROUP), [])
    .reduce<FederatedSuggestions['items']>(
      (result, group) => [
        ...result,
        createGroupItem({
          ...group,
          searchLocation,
          baseResultsPageUrl,
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

  return {
    items,
    footer: { url: footerUrl },
  };
};
