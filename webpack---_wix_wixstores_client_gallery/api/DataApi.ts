/* eslint-disable import/no-cycle, @typescript-eslint/tslint/config */
/* eslint-disable @typescript-eslint/no-unsafe-argument */

import {SiteStore} from '@wix/wixstores-client-storefront-sdk/dist/es/src/viewer-script/site-store/SiteStore';
import {
  GetCategoryInitialDataOldQuery,
  GetCategoryInitialDataQuery,
  GetCategoryInitialDataQueryVariables,
  GetCategoryProductsQuery,
  GetCategoryProductsQueryVariables,
  GetDataQuery,
  GetFilteredProductsQuery,
  GetFilteredProductsQueryVariables,
  GetInitialDataForExternalSourceQuery,
  GetProductItemsByProductIdQuery,
  GetRelatedProductsByAlgorithmQuery,
  GetRelatedProductsByAlgorithmQueryVariables,
  ProductFilters,
  ProductSort,
} from '../graphql/queries-schema';
import {Topology} from '@wix/wixstores-client-core/dist/es/src/constants';
import type {IGetInitialData, IOldGetInitialData} from '../types/galleryTypes';
import {query as getSliderGalleryDataQueryString} from '../graphql/getSliderGalleryData.graphql';
import {query as getDataQueryString} from '../graphql/getData.graphql';
import {query as getCategoryProductsQueryString} from '../graphql/getCategoryProducts.graphql';
import {query as getFilteredProductsQueryString} from '../graphql/getFilteredProducts.graphql';
import {query as GetRelatedProductsByAlgorithmString} from '../graphql/getRelatedProductsByAlgorithm.graphql';
import {query as getCategoryInitialDataQueryString} from '../graphql/getCategoryInitialData.graphql';
import {query as getCategoryInitialDataOldQueryString} from '../graphql/getCategoryInitialDataOld.graphql';
import {query as getProductItemsByProductIdQueryString} from '../graphql/getProductItemsByProductId.graphql';

import _ from 'lodash';
import {DEFAULT_COLLECTION_ID, MAX_PRODUCTS} from '../constants';
import {query as getInitialDataForExternalSource} from '../graphql/getInitialDataForExternalSource.graphql';
import {Filters} from '../types/filters';
import {mapISortingToIProductSortDto, mapISortingToSiteSearchSortDto} from '../services/sort/iSortingToDtoMapper';
import {ISorting, Sorting} from '../types/sorting';

export interface GetProductsResponse {
  list: GetFilteredProductsQuery['catalog']['category']['productsWithMetaData']['list'];
  totalCount: number;
}

export interface GetProductsRequest {
  collectionId: string;
  offset: number;
  limit: number;
  withOptions: boolean;
  withPriceRange: boolean;
  filters?: Filters;
  sorting?: Sorting;
}

export class DataApi {
  private externalDataSourceGetProducts: (GetProductsRequest) => Promise<GetProductsResponse>;

  constructor(private readonly siteStore: SiteStore) {
    //
  }

  public setExternalDataSourceGetProducts(val: (req: GetProductsRequest) => Promise<GetProductsResponse>) {
    this.externalDataSourceGetProducts = val;
  }

  public oldGetInitialData({externalId, compId, limit, withPriceRange, withOptions}: IOldGetInitialData): Promise<{
    data: GetDataQuery;
  }> {
    const data: any = {
      query: getSliderGalleryDataQueryString,
      source: 'WixStoresWebClient',
      operationName: 'getSliderGalleryData',
      variables: {externalId: externalId || '', compId, limit, withPriceRange, withOptions},
    };

    return this.sendRequest(data) as Promise<{
      data: GetDataQuery;
    }>;
  }

  public getInitialData({
    externalId,
    compId,
    limit,
    sort,
    filters,
    offset,
    withOptions,
    withPriceRange,
    mainCollectionId,
  }: IGetInitialData): Promise<{
    data: GetDataQuery;
  }> {
    const maxLimit = Math.min(limit, MAX_PRODUCTS);
    const data = {
      query: getDataQueryString,
      source: 'WixStoresWebClient',
      operationName: 'getData',
      variables: {
        externalId: externalId || '',
        compId: mainCollectionId ? undefined : compId,
        limit: maxLimit,
        sort,
        filters,
        offset,
        withOptions,
        withPriceRange,
        mainCollectionId,
      },
    };

    return this.sendRequest(data) as Promise<{
      data: GetDataQuery;
    }>;
  }

  public getRelatedProductsByAlgorithm({
    externalId = '',
    productIds,
    algorithmId,
    appId,
    withOptions,
    withPriceRange,
  }: {
    externalId: string;
    productIds: string[];
    algorithmId: string;
    appId: string;
    withOptions: boolean;
    withPriceRange: boolean;
  }): Promise<{data: GetRelatedProductsByAlgorithmQuery}> {
    const queryVariables: GetRelatedProductsByAlgorithmQueryVariables = {
      externalId,
      productIds,
      algorithm: {id: algorithmId, appId},
      withOptions,
      withPriceRange,
    };
    const data: any = {
      query: GetRelatedProductsByAlgorithmString,
      source: 'WixStoresWebClient',
      operationName: 'getRelatedProductsByAlgorithm',
      variables: queryVariables,
    };
    return this.sendRequest(data) as Promise<{data: GetRelatedProductsByAlgorithmQuery}>;
  }

  private sendRequest(data: any): Promise<any> {
    return this.siteStore.tryGetGqlAndFallbackToPost(
      this.siteStore.resolveAbsoluteUrl(`/${Topology.STOREFRONT_GRAPHQL_URL}`),
      data
    );
  }

  public async getCategoryProducts(
    variables: GetCategoryProductsQueryVariables
  ): Promise<{data: GetCategoryProductsQuery}> {
    const data: any = {
      query: getCategoryProductsQueryString,
      source: 'WixStoresWebClient',
      operationName: 'getCategoryProducts',
      variables,
    };

    return this.sendRequest(data);
  }

  public async getProductsByOffset(request: GetProductsRequest) {
    const {collectionId, offset, limit, filters, withOptions, withPriceRange, sorting} = request;
    if (this.externalDataSourceGetProducts) {
      return this.externalDataSourceGetProducts({
        ...request,
        sorting: mapISortingToSiteSearchSortDto(sorting as ISorting),
      });
    }

    const response = await this.getProductsByGraphQL(
      collectionId,
      offset,
      limit,
      filters as ProductFilters,
      withOptions,
      withPriceRange,
      sorting as ISorting
    );
    const {list, totalCount} = response.data.catalog.category.productsWithMetaData;
    return {list: _.compact(list), totalCount};
  }

  public async getProducts({
    collectionId,
    filters,
    fromIndex,
    sorting,
    toIndex,
    withOptions,
    withPriceRange,
  }: {
    collectionId: string;
    fromIndex: number;
    toIndex: number;
    withOptions: boolean;
    withPriceRange: boolean;
    filters?: Filters;
    sorting?: ISorting;
  }): Promise<GetProductsResponse> {
    const offset = fromIndex;
    const limit = toIndex - fromIndex;
    return this.getProductsByOffset({
      collectionId,
      filters,
      sorting,
      withOptions,
      withPriceRange,
      offset,
      limit,
    });
  }

  public async getProductsByGraphQL(
    mainCollectionId: string,
    offset: number,
    limit: number,
    filters: ProductFilters | null,
    withOptions: boolean,
    withPriceRange: boolean,
    sorting?: ISorting
  ): Promise<{data: GetFilteredProductsQuery}> {
    const sort = mapISortingToIProductSortDto(sorting) as ProductSort;

    const variables: GetFilteredProductsQueryVariables = {
      mainCollectionId,
      offset,
      limit,
      sort,
      filters,
      withOptions,
      withPriceRange,
    };

    const data = {
      variables,
      query: getFilteredProductsQueryString,
      source: 'WixStoresWebClient',
      operationName: 'getFilteredProducts',
    };

    return this.sendRequest(data);
  }

  public async getCategoryInitialData({
    externalId,
    currentCategoryId,
  }: GetCategoryInitialDataQueryVariables): Promise<{data: GetCategoryInitialDataQuery}> {
    const data = {
      variables: {
        externalId: externalId || /* istanbul ignore next */ '',
        currentCategoryId: currentCategoryId || DEFAULT_COLLECTION_ID,
      },
      query: getCategoryInitialDataQueryString,
      source: 'WixStoresWebClient',
      operationName: 'getCategoryInitialData',
    };

    return this.sendRequest(data);
  }

  public async getCategoryInitialDataOld({
    externalId,
  }: {
    externalId?: string;
  }): Promise<{data: GetCategoryInitialDataOldQuery}> {
    const data = {
      variables: {externalId: externalId || /* istanbul ignore next */ ''},
      query: getCategoryInitialDataOldQueryString,
      source: 'WixStoresWebClient',
      operationName: 'getCategoryInitialData',
    };

    return this.sendRequest(data);
  }

  public async getInitialDataForExternalSource(
    externalId: string
  ): Promise<{data: GetInitialDataForExternalSourceQuery}> {
    const data: any = {
      query: getInitialDataForExternalSource,
      source: 'WixStoresWebClient',
      operationName: 'getInitialDataForExternalSource',
      variables: {externalId: externalId || /* istanbul ignore next */ ''},
    };

    return this.sendRequest(data);
  }

  public async getProductItemsByProductId(productId: string): Promise<{data: GetProductItemsByProductIdQuery}> {
    const data = {
      variables: {productId},
      query: getProductItemsByProductIdQueryString,
      source: 'WixStoresWeb',
      operationName: 'getProductItemsByProductId',
    };
    return this.sendRequest(data);
  }
}
