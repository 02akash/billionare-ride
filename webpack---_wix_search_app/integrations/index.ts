import { facets as storesFacets } from './stores/facets';
import { facets as forumFacets } from './forum/facets';
import {
  FacetDescriptor,
  FacetFilterValueMap,
  FacetOptionsMap,
  facetsConstraint,
} from '../types/core/facets';
import { SearchDocumentType } from '@wix/client-search-sdk';
import { ValueTypes } from '../types';
import { entries } from '../utils';

facetsConstraint(storesFacets);
facetsConstraint(forumFacets);

export const allFacets = {
  [SearchDocumentType.Products]: storesFacets,
  [SearchDocumentType.Forums]: forumFacets,
};

export type AvailableFacets = typeof storesFacets & typeof forumFacets;
export const availableFacets: AvailableFacets = {
  ...storesFacets,
  ...forumFacets,
};

export type ForumFacets = typeof forumFacets;
export type EcomFacets = typeof storesFacets;

export const facetApiNameToFacetName = entries(availableFacets).reduce(
  (map, [facetName, descriptor]) => {
    const facetApiName =
      (descriptor as FacetDescriptor).serializerConfig?.facetNameForApi ??
      (facetName as string);
    map[facetApiName] = facetName;
    return map;
  },
  {} as Record<string, keyof typeof availableFacets>,
);

export const facetNameToApiName = entries(facetApiNameToFacetName).reduce(
  (map, [facetNameForApi, facetName]) => {
    map[facetName] = facetNameForApi;
    return map;
  },
  {} as Record<keyof typeof availableFacets, string>,
);

type Permissive<T> = {
  [key in keyof T]: ValueTypes<T>;
};

export type FacetFilterValue = {
  -readonly [key in keyof AvailableFacets]?: FacetFilterValueMap[AvailableFacets[key]['type']];
};

export type PermissiveFacetFilterValue = Permissive<FacetFilterValue>;

export type FacetOptionsValue = {
  -readonly [key in keyof AvailableFacets]?: FacetOptionsMap[AvailableFacets[key]['type']];
};

export type PermissiveFacetOptionsValue = Permissive<FacetOptionsValue>;
