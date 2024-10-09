import { ILocation } from '@wix/yoshi-flow-editor';

import {
  ILocationSearchRequest,
  IEncodedSearchPathParams,
  SearchQueryParam,
} from './location.types';
import { DEFAULT_SEARCH_REQUEST } from './params/defaultSearchRequest';
import { encodeSearchRequestToQueryParams } from './params/encodeSearchRequest';
import {
  decodeSearchRequestFromPathParams,
  decodeSearchRequestFromQueryParams,
} from './params/decodeSearchRequest';
import { availableFacets } from '../../integrations';

const PATH_PARAM_VALUE_DELIMITER = '-';
const QUERY_PARAMS = (Object.values(SearchQueryParam) as string[]).concat(
  Object.keys(availableFacets),
);

export const decodeParams = (location: ILocation): ILocationSearchRequest => {
  return {
    ...DEFAULT_SEARCH_REQUEST,
    ...decodeSearchRequestFromQueryParams(location.query),
    ...decodeParamsFromPath(location),
  };
};

export const decodeParamsFromPath = (
  location: ILocation,
): ILocationSearchRequest => {
  // First item in location path is our search results page name
  const path = location.path.slice(1);

  const pathParams = path.reduce<IEncodedSearchPathParams>((result, param) => {
    const [key, ...value] = param.split(PATH_PARAM_VALUE_DELIMITER);

    return {
      ...result,
      [key]: value.join(PATH_PARAM_VALUE_DELIMITER),
    };
  }, {});

  return decodeSearchRequestFromPathParams(pathParams);
};

export const encodeParams = (
  request: ILocationSearchRequest,
  currentQuery: ILocation['query'],
): string => {
  const queryParams = encodeQueryParams(request, currentQuery);
  return queryParams ? `?${queryParams}` : '';
};

const encodeQueryParams = (
  request: ILocationSearchRequest,
  currentQuery: ILocation['query'],
): string => {
  const params = encodeSearchRequestToQueryParams(request);
  const query = { ...currentQuery };

  const keys: string[] = QUERY_PARAMS.concat(
    ...Object.keys(request.facetsFilters || {}),
  );

  keys.forEach((param) => {
    if (!params[param as keyof typeof params]) {
      delete query[param]; // eslint-disable-line @typescript-eslint/no-dynamic-delete
    }
  });

  Object.keys(params).forEach((param: string) => {
    const value = params[param as keyof typeof params];

    if (value !== undefined) {
      query[param] = value;
    } else {
      delete query[param]; // eslint-disable-line @typescript-eslint/no-dynamic-delete
    }
  });

  const queryParams = new URLSearchParams(
    Object.entries(query).sort(([paramA], [paramB]) => {
      const isSearchQueryParamA = isSearchQueryParam(paramA);
      const isSearchQueryParamB = isSearchQueryParam(paramB);

      if (isSearchQueryParamA && isSearchQueryParamB) {
        return QUERY_PARAMS.indexOf(paramA) - QUERY_PARAMS.indexOf(paramB);
      } else if (isSearchQueryParamA && !isSearchQueryParamB) {
        return -1; // Our params always in front
      } else if (isSearchQueryParamB && !isSearchQueryParamA) {
        return 1; // Our params always in front
      } else {
        return 0;
      }
    }),
  );

  return queryParams.toString();
};

const isSearchQueryParam = (param: unknown): param is SearchQueryParam => {
  return typeof param === 'string'
    ? QUERY_PARAMS.includes(param as SearchQueryParam)
    : false;
};
