import {
  ISearchRequest,
  ISearchResponse,
  ISearchResponseTotals,
} from '@wix/client-search-sdk';
import { startCase } from 'lodash';
import {
  availableFacets,
  FacetFilterValue,
  FacetOptionsValue,
} from '../../../../../integrations';
import {
  CategoryOptions,
  FacetDescriptor,
  FacetFilterValueMap,
  FacetOptionsMap,
} from '../../../../../types/core/facets';
import { assertUnreachable, keys } from '../../../../../utils';
import {
  convertRequestParamsToFacetsFilter,
  extractFacetsFromSearchResponse,
  hasAnySelectedFacets,
} from '../facets';
import { getVisibleCategories } from './getVisibleCategories';

export function getBiTotals(totals: ISearchResponseTotals | undefined): string {
  if (!totals) {
    return '0';
  }

  return JSON.stringify(totals);
}

const convertCategoryFacetOptionToBiFormat = (
  value: CategoryOptions,
): { value: string; count: number }[] =>
  value.map(({ label, count }) => ({
    value: label,
    count,
  }));

const convertFacetOptionsToBiFormat = (options: FacetOptionsValue) => {
  return keys(options).reduce((biFacets, facetName) => {
    const value = options[facetName];
    const facetDescriptor = availableFacets[facetName] as FacetDescriptor;

    if (!value) {
      return biFacets;
    }

    switch (facetDescriptor.type) {
      case 'category':
      case 'property': {
        const val = value as FacetOptionsMap[typeof facetDescriptor.type];
        biFacets[facetName] = convertCategoryFacetOptionToBiFormat(val);
        break;
      }
      case 'minMaxAggregation': {
        const val = value as FacetOptionsMap[typeof facetDescriptor.type];
        biFacets['min' + startCase(facetName)] = val.min;
        biFacets['max' + startCase(facetName)] = val.max;
        break;
      }
      default:
        assertUnreachable(facetDescriptor);
    }

    return biFacets;
  }, {} as Record<string, number | { value: string; count: number }[]>);
};

const convertFacetFilterToBiFormat = (filter: FacetFilterValue) => {
  return keys(filter).reduce((biFacets, facetName) => {
    const value = filter[facetName];
    if (!value) {
      return biFacets;
    }
    const facetDescriptor = availableFacets[facetName] as FacetDescriptor;

    switch (facetDescriptor.type) {
      case 'category': {
        const val = value as FacetFilterValueMap[typeof facetDescriptor.type];
        if (val) {
          biFacets[facetName] = val;
        }
        break;
      }
      case 'property': {
        const val = value as FacetFilterValueMap[typeof facetDescriptor.type];
        if (val) {
          biFacets[facetName] = val;
        }
        break;
      }
      case 'minMaxAggregation': {
        const val = value as FacetFilterValueMap[typeof facetDescriptor.type];
        if (val?.min) {
          biFacets['min' + startCase(facetName)] = val.min;
        }
        if (val?.max) {
          biFacets['max' + startCase(facetName)] = val.max;
        }
        break;
      }
      default:
        assertUnreachable(facetDescriptor);
    }

    return biFacets;
  }, {} as Record<string, string[] | string | number>);
};

export function getBiAvailableFacets(
  searchRequest: ISearchRequest,
  searchResponse: ISearchResponse,
) {
  if (searchResponse.facets.length === 0) {
    return;
  }

  const allFacets = extractFacetsFromSearchResponse(searchResponse);

  const selectedFacets = convertRequestParamsToFacetsFilter(searchRequest);
  const availableBiFacets = {
    ...convertFacetOptionsToBiFormat(allFacets),
    collections: convertCategoryFacetOptionToBiFormat(
      getVisibleCategories(
        allFacets.collections ?? [],
        selectedFacets.collections ?? [],
      ),
    ),
  };

  return JSON.stringify(availableBiFacets);
}

export function getBiSelectedFacets(searchRequest: ISearchRequest) {
  const selectedFacets = convertRequestParamsToFacetsFilter(searchRequest);
  return hasAnySelectedFacets(selectedFacets)
    ? JSON.stringify(convertFacetFilterToBiFormat(selectedFacets))
    : undefined;
}
