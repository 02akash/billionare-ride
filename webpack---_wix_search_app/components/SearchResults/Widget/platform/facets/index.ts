import {
  ISearchRequest,
  ISearchRequestFilter,
  ISearchResponse,
  ISearchRequestFilterItem,
  SearchDocumentType,
} from '@wix/client-search-sdk';
import {
  availableFacets,
  FacetFilterValue,
  FacetOptionsValue,
  facetApiNameToFacetName,
  facetNameToApiName,
  PermissiveFacetOptionsValue,
  PermissiveFacetFilterValue,
  allFacets,
} from '../../../../../integrations';
import { keys, assertUnreachable } from '../../../../../utils';
import {
  FacetFilterValueMap,
  FacetOptionsMap,
} from '../../../../../types/core/facets';

export const convertFacetsFilterToRequestParams = (
  state: FacetFilterValue,
  documentType: SearchDocumentType | undefined,
): ISearchRequestFilter | undefined => {
  const facetFilterKeys = keys(state);
  const requestParamsParts = facetFilterKeys.map((facetName) => {
    const termType = availableFacets[facetName].type;
    const facetApiName = facetNameToApiName[facetName];

    const appFacets: string[] = keys(
      allFacets[documentType as keyof typeof allFacets],
    );
    if (!appFacets.includes(facetName)) {
      return undefined;
    }

    switch (termType) {
      case 'category': {
        const val = state[facetName] as FacetFilterValueMap[typeof termType];
        return val?.length
          ? {
              [facetApiName]: { $any: val },
            }
          : undefined;
      }
      case 'property': {
        const val = state[facetName] as FacetFilterValueMap[typeof termType];
        return val ? { [facetApiName]: { $eq: val } } : undefined;
      }
      case 'minMaxAggregation': {
        const val = state[facetName] as FacetFilterValueMap[typeof termType];
        const hasMin = val?.min !== undefined;
        const hasMax = val?.max !== undefined;
        if (hasMin || hasMax) {
          return {
            [facetApiName]: {
              ...(hasMin && { $gte: val?.min }),
              ...(hasMax && { $lte: val?.max }),
            },
          };
        }
        break;
      }
      default: {
        assertUnreachable(termType);
      }
    }
    return undefined;
  });

  return requestParamsParts.length
    ? {
        $and: requestParamsParts.filter(Boolean) as ISearchRequestFilter[],
      }
    : undefined;
};

export const extractFacetsFromSearchResponse = ({
  facets,
}: Pick<ISearchResponse, 'facets'>): FacetOptionsValue => {
  return facets.reduce((facetsState, clause) => {
    if ('terms' in clause) {
      const facetApiName = clause.terms.facet;
      const facetName = facetApiNameToFacetName[facetApiName];
      facetsState[facetName] = clause.terms.facets.map((apiFacet) => ({
        label: apiFacet.facetValue,
        count: apiFacet.count,
      }));
    } else if ('maxAggregation' in clause) {
      const facetApiName = clause.maxAggregation.facet;
      const facetName = facetApiNameToFacetName[facetApiName];
      if (!facetsState[facetName]) {
        facetsState[facetName] = {} as FacetOptionsMap['minMaxAggregation'];
      }
      (facetsState[facetName] as FacetOptionsMap['minMaxAggregation']).max =
        clause.maxAggregation.maxValue;
    } else if ('minAggregation' in clause) {
      const facetApiName = clause.minAggregation.facet;
      const facetName = facetApiNameToFacetName[facetApiName];
      if (!facetsState[facetName]) {
        facetsState[facetName] = {} as FacetOptionsMap['minMaxAggregation'];
      }
      (facetsState[facetName] as FacetOptionsMap['minMaxAggregation']).min =
        clause.minAggregation.minValue;
    } else {
      assertUnreachable(clause);
    }
    return facetsState;
  }, {} as PermissiveFacetOptionsValue) as FacetOptionsValue;
};

export const convertRequestParamsToFacetsFilter = (
  searchRequest: ISearchRequest,
): FacetFilterValue => {
  return (
    (searchRequest.filter?.$and?.reduce(
      (facetsFilter, searchRequestFilterItem) => {
        const facetApiName = Object.keys(searchRequestFilterItem)[0];
        const facetName = facetApiNameToFacetName[facetApiName];
        const value = searchRequestFilterItem[
          facetApiName
        ] as ISearchRequestFilterItem;
        const facetDescriptor = availableFacets[facetName];

        switch (facetDescriptor.type) {
          case 'category': {
            facetsFilter[facetName] = value.$any ?? [];
            break;
          }
          case 'property': {
            facetsFilter[facetName] = value.$eq;
            break;
          }
          case 'minMaxAggregation': {
            facetsFilter[facetName] = {
              ...(value.$gte ? { min: value.$gte } : undefined),
              ...(value.$lte ? { max: value.$lte } : undefined),
            };
            break;
          }
          default:
            assertUnreachable(facetDescriptor);
        }
        return facetsFilter;
      },
      {} as PermissiveFacetFilterValue,
    ) as FacetFilterValue) || {}
  );
};

export function convertFacetFilterToSearchResponseFacets(
  facetState: FacetOptionsValue,
): ISearchResponse['facets'] {
  return keys(facetState).reduce((facets, facetName) => {
    const descriptor = availableFacets[facetName];
    switch (descriptor.type) {
      case 'property':
      case 'category': {
        const value = facetState[
          facetName
        ] as FacetOptionsMap[typeof descriptor.type];
        facets.push({
          terms: {
            facet: facetName,
            facets: value.map((val) => ({
              facetValue: val.label,
              count: val.count,
            })),
          },
        });
        break;
      }
      case 'minMaxAggregation': {
        const value = facetState[
          facetName
        ] as FacetOptionsMap[typeof descriptor.type];

        facets.push(
          {
            maxAggregation: {
              facet: facetNameToApiName[facetName],
              maxValue: value.max,
            },
          },
          {
            minAggregation: {
              facet: facetNameToApiName[facetName],
              minValue: value.min,
            },
          },
        );
        break;
      }
      default:
        assertUnreachable(descriptor);
    }

    return facets;
  }, [] as ISearchResponse['facets']);
}

export const hasAnySelectedFacets = (filter: FacetFilterValue) => {
  return keys(filter).some((facetName) => Boolean(filter[facetName]));
};
