import { omit } from 'lodash';
import {
  AvailableFacets,
  availableFacets,
  FacetFilterValue,
} from '../../../../../integrations';
import { getFacetDescriptorsByDocumentType } from '../../../../../integrations/utils';
import { keys, assertUnreachable } from '../../../../../utils';
import {
  FacetDescriptor,
  FacetFilterValueMap,
} from '../../../../../types/core/facets';
import { SearchRequestStatus } from '../../types/types';
import {
  convertFacetsFilterToRequestParams,
  convertRequestParamsToFacetsFilter,
} from '../facets';
import { getSearchResponse } from './getSearchResponse';
import { SearchParams } from './search';
import { WarmupDataKey } from './warmupDataKey';

const hasDependantFacetsChanged = (
  facetName: keyof typeof availableFacets,
  facetDescriptors: AvailableFacets,
  facetFilter: FacetFilterValue,
  previousFacetFilter: FacetFilterValue,
): boolean => {
  const dependantFacetsNames = keys(facetDescriptors).filter((f) => {
    return facetName !== f;
  });
  return dependantFacetsNames.some((dependentFacetName) => {
    const facetDescriptor = facetDescriptors[dependentFacetName];
    switch (facetDescriptor.type) {
      case 'category': {
        const prevValue = previousFacetFilter[
          dependentFacetName
        ] as FacetFilterValueMap[typeof facetDescriptor.type];
        const currValue = facetFilter[
          dependentFacetName
        ] as FacetFilterValueMap[typeof facetDescriptor.type];
        return (
          prevValue?.length !== currValue?.length ||
          !prevValue?.every((category) => currValue?.includes(category))
        );
      }
      case 'property': {
        const prevValue = previousFacetFilter[
          dependentFacetName
        ] as FacetFilterValueMap[typeof facetDescriptor.type];
        const currValue = facetFilter[
          dependentFacetName
        ] as FacetFilterValueMap[typeof facetDescriptor.type];
        return prevValue !== currValue;
      }
      case 'minMaxAggregation': {
        const prevValue = previousFacetFilter[
          dependentFacetName
        ] as FacetFilterValueMap[typeof facetDescriptor.type];
        const currValue = facetFilter[
          dependentFacetName
        ] as FacetFilterValueMap[typeof facetDescriptor.type];
        return (
          prevValue?.min !== currValue?.min || prevValue?.max !== currValue?.max
        );
      }
      default:
        assertUnreachable(facetDescriptor);
    }
  });
};

export const getFacetsResponse = (searchParams: SearchParams) => {
  const { searchRequest, previousSearchResponse } = searchParams;

  const filter = convertRequestParamsToFacetsFilter(searchRequest);

  if (!filter) {
    return [];
  }

  const promises = keys(filter).map(async (facetName) => {
    const filterValue = filter[facetName];
    if (!filterValue) {
      return Promise.resolve(undefined);
    }

    const facetDescriptors = getFacetDescriptorsByDocumentType(
      searchParams.searchRequest.documentType,
    );

    if (!facetDescriptors) {
      return Promise.resolve(undefined);
    }

    const facetFilterWithoutCurrentFacet = omit(filter, facetName);
    const previousFilter = convertRequestParamsToFacetsFilter(
      searchParams.previousSearchRequest,
    );

    const shouldRecalculateFacetOnDependentFacetChange = (
      facetDescriptors[facetName] as FacetDescriptor
    )?.refreshOnDependentFacetChange;

    if (
      searchParams.previousSearchRequestStatus ===
        SearchRequestStatus.Initial ||
      (shouldRecalculateFacetOnDependentFacetChange &&
        hasDependantFacetsChanged(
          facetName,
          facetDescriptors,
          filter,
          previousFilter,
        ))
    ) {
      return {
        facetName,
        ...(await getSearchResponse({
          ...searchParams,
          searchRequest: {
            ...searchRequest,
            filter: convertFacetsFilterToRequestParams(
              facetFilterWithoutCurrentFacet,
              searchRequest.documentType,
            ),
            paging: {
              page: 0,
              pageSize: 0,
            },
          },
          shouldShowSamples: false,
          warmupDataKey: WarmupDataKey.ProductsPriceFacetResponse,
        })),
      };
    } else {
      return Promise.resolve({ ...previousSearchResponse, facetName });
    }
  });

  return promises;
};
