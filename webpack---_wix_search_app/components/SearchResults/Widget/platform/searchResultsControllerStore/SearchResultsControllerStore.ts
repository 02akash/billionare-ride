import { debounce, isMatch } from 'lodash';
import { ITEM_TYPES } from '@wix/advanced-seo-utils';
import { ControllerFlowAPI, IWixAPI } from '@wix/yoshi-flow-editor';
import { createSlotVeloAPIFactory } from '@wix/widget-plugins-ooi/velo';
import {
  ClientSearchSDK,
  ISearchProductDocument,
  ISearchRequest,
  ISearchResponse,
  IDemoContentOptions,
  SearchDocumentType,
} from '@wix/client-search-sdk';
import { AppSettings } from '@wix/search-settings-client';
import {
  documentClick,
  documentTypeChange,
  searchSubmit,
  searchResultsClickResetFacets,
} from '@wix/bi-logger-wix-search-widget/v2';
import { documentClickParams as BiDocumentClickParams } from '@wix/bi-logger-wix-search-widget/v2/types';
import { Spec } from '@wix/site-search-common';

import { IExtendedControllerParams } from '../../../../../lib/platform.types';
import {
  ISearchLocation,
  ILocationSearchRequest,
} from '../../../../../lib/location';
import { getTotalPages } from '../pagination';
import { addProductToCart } from '../products';
import {
  DocumentTypeChangeSource,
  SearchRequestStatus,
} from '../../types/types';
import { BiSearchOrigin, createBiCorrelationId } from '../../../../../lib/bi';
import {
  DocumentClickOrigin,
  ISearchResultsControllerProps,
  ISearchSample,
  ISeoItemData,
  OnFacetChangeFn,
  RequestFactoryParams,
  SearchResultsControllerStoreState,
} from './SearchResultsControllerStore.types';
import { getOrdering } from '../sort';
import { WarmupDataKey, search } from '../search';
import settingsParams from '../../../settingsParams';
import {
  createSearchRequestBiLogger,
  getBiTotals,
  getBiAvailableFacets,
  getBiSelectedFacets,
} from '../bi';
import { getAbsoluteDocumentIndex } from './getAbsoluteDocumentIndex';
import { equalSearchRequests } from './equalSearchRequests';
import { reportError } from '../../../../../lib/errors';
import { DEFAULT_SORT_OPTION } from '../../../../../lib/sort';
import { ScrollToWidget } from '../../../../../lib/scrollToWidget';
import { SessionStore, SessionStoreKey } from '../../../../../lib/sessionStore';
import { getFederatedResponse } from '../search/getFederatedResponse';
import { getDocumentTypes } from '../search/getDocumentTypes';
import { getResponseTotals } from '../search/getResponseTotals';
import { convertFederatedResponse } from '../search/convertFederatedResponse';
import {
  convertFacetDescriptorsToApiFacets,
  getFacetDescriptorsByDocumentType,
} from '../../../../../integrations/utils';
import {
  convertFacetsFilterToRequestParams,
  extractFacetsFromSearchResponse,
} from '../facets';
import { FacetApiDescriptors } from '../../../../../types/core/facets';
import { FacetOptionsValue } from '../../../../../integrations';
import { SlotContentSDKProxy } from '@wix/widget-plugins-ooi/dist/types/velo/createSdkProxy';

export class SearchResultsControllerStore {
  private readonly flowAPI: ControllerFlowAPI;
  private readonly wixCodeApi: IWixAPI;
  private readonly setComponentProps: (
    props: SearchResultsControllerStoreState,
  ) => void;
  private readonly sessionStore: SessionStore;
  private readonly searchSDK: ClientSearchSDK;
  private readonly searchLocation: ISearchLocation;

  private demoContentOptions!: IDemoContentOptions;
  private state: SearchResultsControllerStoreState;
  private prevItemsPerPage: number;
  private getAppSettings: () => Promise<AppSettings>;

  constructor({
    platformAPIs,
    wixCodeApi,
    searchSDK,
    searchLocation,
    setProps,
    flowAPI,
    getAppSettings,
  }: IExtendedControllerParams) {
    this.flowAPI = flowAPI;
    this.setComponentProps = setProps;
    this.wixCodeApi = wixCodeApi;
    this.searchSDK = searchSDK;
    this.searchLocation = searchLocation;
    this.getAppSettings = getAppSettings;

    const { errorMonitor, environment } = flowAPI;
    const { language, isViewer } = environment;
    const isDemoContent = !isViewer;
    const locationParams = this.getSearchRequestParamsFromLocation();
    const locale = wixCodeApi.site.regionalSettings || language;
    const itemsPerPage = flowAPI.settings.get(settingsParams.itemsPerPage);

    // Save initial SSR location params (used later to validate warmupData)
    if (environment.isSSR) {
      wixCodeApi.window.warmupData.set(
        WarmupDataKey.LocationParams,
        locationParams,
      );
    }

    const searchRequest = this.getSearchRequestFromLocationParams(
      locationParams,
      itemsPerPage,
    );

    this.sessionStore = new SessionStore(platformAPIs);

    this.state = {
      ...this.getEmptyResponseStateProps(),
      apiErrorDetails: undefined,
      locale,
      searchResultsAbsoluteUrl: '',
      appSettings: {} as AppSettings,
      searchRequest,
      searchRequestStatus: SearchRequestStatus.Initial,
      visibleDocumentTypes: [],
      onDocumentTypeChange: this.handleDocumentTypeChange,
      onQuerySubmit: this.handleQuerySubmit,
      onPageChange: this.handlePageChange,
      onSortChange: this.handleSortChange,
      onDocumentClick: this.handleDocumentClick,
      onProductAddToCart: this.handleProductAddToCart,
      onFacetsFilterChange: this.handleFacetsFilterChange,
      onFacetsFilterReset: this.handleFacetsFilterReset,
      onScrollToWidget: this.handleScrollToWidget,
      // TODO: cleanup when resolved https://github.com/wix-private/native-components-infra/pull/28
      viewMode: wixCodeApi.window.viewMode,
      isDemoContent,
      facets: {} as FacetOptionsValue,
      facetFilters: {},
      selectedSortOption: locationParams.sort ?? DEFAULT_SORT_OPTION,
      locationQuery: wixCodeApi.location.query,
      scrollToWidget: this.getScrollToWidget(),
      // Sets "height: auto" for our widget in Editor in TB.
      fitToContentHeight: true,
      heightOverflow: true,
      shouldContainProductWidget: false,
    };

    this.state.facets = this.getFacetsFromResponse(
      this.state.searchRequest,
      this.state.searchResponse,
    );
    this.state.facetFilters = locationParams.facetsFilters || {};

    if (isDemoContent) {
      this.setDemoContentOptions({
        shouldHaveSearchResults: true,
      });
    }

    this.prevItemsPerPage = itemsPerPage;

    wixCodeApi.location.onChange(async () => {
      try {
        const stateSearchRequest = this.state.searchRequest;
        const locationSearchRequest = this.getSearchRequestFromLocationParams(
          this.getSearchRequestParamsFromLocation(),
          stateSearchRequest.paging.pageSize,
        );
        if (equalSearchRequests(locationSearchRequest, stateSearchRequest)) {
          return;
        }

        this.state.locationQuery = this.wixCodeApi.location.query;
        await this.changeSearchRequest(locationSearchRequest);
      } catch (error) {
        reportError(errorMonitor, error);
      }
    });
  }

  private readonly handleScrollToWidget = () => {
    this.sessionStore.remove(SessionStoreKey.ScrollToWidget);

    this.setState({
      scrollToWidget: undefined,
    });
  };

  private shouldShowFacets = (documentType?: SearchDocumentType) => {
    const { settings } = this.flowAPI;
    switch (documentType) {
      case SearchDocumentType.Products:
        return settings.get(settingsParams.isProductsFacetsEnabled);
      case SearchDocumentType.Forums:
        return settings.get(settingsParams.isForumsFacetsEnabled);
      default:
        return false;
    }
  };

  private shouldUseWarmupData = (): boolean => {
    const { experiments, environment } = this.flowAPI;
    const { searchRequestStatus } = this.state;

    if (
      !experiments.enabled(Spec.UseWarmupData) ||
      searchRequestStatus !== SearchRequestStatus.Initial
    ) {
      return false;
    }

    if (environment.isSSR) {
      return true;
    }

    const ssrLocationParams = this.wixCodeApi.window.warmupData.get(
      WarmupDataKey.LocationParams,
    );

    return (
      ssrLocationParams &&
      isMatch(ssrLocationParams, this.getSearchRequestParamsFromLocation())
    );
  };

  private getFacetsFromResponse(
    searchRequest: ISearchRequest,
    searchResponse: ISearchResponse,
  ): FacetOptionsValue {
    return {
      ...this.state.facets,
      ...extractFacetsFromSearchResponse(searchResponse),
    };
  }

  private getSearchRequestParamsFromLocation(): ILocationSearchRequest {
    return this.searchLocation.decodeParams();
  }

  private getSearchRequestFromLocationParams(
    locationParams: ILocationSearchRequest,
    pageSize: number,
  ): ISearchRequest {
    return this.searchLocation.toSDKSearchRequest(locationParams, pageSize);
  }

  private setDemoContentOptions(partialOptions: IDemoContentOptions) {
    if (
      this.demoContentOptions &&
      isMatch(this.demoContentOptions, partialOptions)
    ) {
      return;
    }

    this.demoContentOptions = {
      ...this.demoContentOptions,
      ...partialOptions,
    };

    this.searchSDK.useDemoContent(this.demoContentOptions);
  }

  private setState(partialState: Partial<SearchResultsControllerStoreState>) {
    this.state = {
      ...this.state,
      ...partialState,
    };

    this.setComponentProps(this.state);
  }

  private getBiSearchCorrelationId(): string | undefined {
    return (
      this.sessionStore.get(SessionStoreKey.BiSearchCorrelation) || undefined
    );
  }

  private getScrollToWidget(): ScrollToWidget | undefined {
    return (
      (this.sessionStore.get(
        SessionStoreKey.ScrollToWidget,
      ) as ScrollToWidget) || undefined
    );
  }

  private getBiSearchOrigin(): string {
    return (
      this.sessionStore.get(SessionStoreKey.BiSearchOrigin) ||
      BiSearchOrigin.Other
    );
  }

  private buildSearchRequest({
    searchRequest,
    visibleDocumentTypes,
  }: RequestFactoryParams) {
    // Requested document type is not visible (per display settings etc)
    const updateDocumentType =
      !searchRequest.documentType ||
      (searchRequest.documentType &&
        !visibleDocumentTypes.includes(searchRequest.documentType));

    const documentType = updateDocumentType
      ? visibleDocumentTypes[0] ?? SearchDocumentType.All
      : searchRequest.documentType;

    const searchRequestWithDocumentType: ISearchRequest = {
      ...searchRequest,
      documentType,
    };

    const facetsEnabled = this.shouldShowFacets(documentType);

    const updatedRequest = {
      ...searchRequestWithDocumentType,
      includeSeoHidden: this.state.appSettings.isSeoHiddenIncluded,
      ...(facetsEnabled &&
        this.withGenericFacets(searchRequestWithDocumentType)),
    };
    return this.withOrdering(updatedRequest);
  }

  private async search(
    searchRequest: ISearchRequest,
    previousSearchRequestStatus: SearchRequestStatus,
    reloadVisibleDocumentTypes = false,
  ) {
    const { searchSDK, searchLocation, sessionStore, wixCodeApi } = this;
    const { environment, experiments, errorMonitor } = this.flowAPI;

    const {
      previousQuery,
      searchResultsAbsoluteUrl,
      isDemoContent,
      appSettings,
    } = this.state;

    const previousVisibleDocumentTypes = reloadVisibleDocumentTypes
      ? undefined
      : this.state.visibleDocumentTypes;

    const correlationId = this.getBiSearchCorrelationId();
    const biLogger = !environment.isSSR
      ? createSearchRequestBiLogger({
          bi: this.flowAPI.bi!,
          isDemoContent,
          correlationId,
          origin: this.getBiSearchOrigin(),
        })
      : undefined;

    const useWarmupData = this.shouldUseWarmupData();

    const shouldUpdateTotals =
      !this.state.searchResponseTotals || previousQuery !== searchRequest.query;

    const shouldLoadFederated =
      !previousVisibleDocumentTypes ||
      !searchRequest.documentType ||
      searchRequest.documentType === SearchDocumentType.All ||
      shouldUpdateTotals;

    const federatedResponse = shouldLoadFederated
      ? await getFederatedResponse({
          searchRequest: {
            ...searchRequest,
            includeSeoHidden: this.state.appSettings.isSeoHiddenIncluded,
          },
          searchSDK,
          environment,
          correlationId,
          wixCodeApi,
          useWarmupData,
        })
      : { results: [] };

    if ('isError' in federatedResponse) {
      const apiErrorDetails = federatedResponse.errorDetails;
      reportError(errorMonitor, new Error(JSON.stringify(apiErrorDetails)));
      return {
        ...this.getErrorStateProps(),
        apiErrorDetails,
        visibleDocuthimentTypes: this.state.visibleDocumentTypes,
      };
    }

    const visibleDocumentTypes =
      shouldUpdateTotals || !previousVisibleDocumentTypes
        ? getDocumentTypes(federatedResponse, appSettings, experiments)
        : this.state.visibleDocumentTypes;

    const searchResponseTotals =
      !this.state.searchResponseTotals ||
      shouldUpdateTotals ||
      !previousVisibleDocumentTypes
        ? getResponseTotals(federatedResponse, visibleDocumentTypes)
        : this.state.searchResponseTotals;

    searchRequest = this.buildSearchRequest({
      searchRequest,
      federatedResponse,
      visibleDocumentTypes,
    });

    const facetsEnabled = this.shouldShowFacets(searchRequest.documentType);

    const { searchResponse } = await search({
      searchRequest,
      searchSDK,
      environment,
      correlationId,
      facetsEnabled,
      sessionStore,
      biLogger,
      wixCodeApi,
      useWarmupData,
      federatedResponse,
      visibleDocumentTypes,
      searchResponseTotals,
      previousSearchRequest: this.state.searchRequest,
      previousSearchRequestStatus: this.state.searchRequestStatus,
      previousSearchResponse: this.state.searchResponse,
    });

    if ('isError' in searchResponse) {
      const apiErrorDetails = searchResponse.errorDetails;
      reportError(errorMonitor, new Error(JSON.stringify(apiErrorDetails)));
      return {
        ...this.getErrorStateProps(),
        apiErrorDetails,
        visibleDocumentTypes,
      };
    }

    const searchSamples = convertFederatedResponse({
      federatedResponse,
      visibleDocumentTypes,
      searchLocation,
      searchResultsAbsoluteUrl,
      query: searchRequest.query,
    });

    // NOTE: wixCodeApi.site.currency can return undefined for some websites - we are
    // extracting currency from products schema instead.
    const currency =
      this.extractCurrencyFromSamples(searchSamples) || this.state.currency;

    const result = {
      apiErrorDetails: undefined,
      visibleDocumentTypes,
      currency,
      searchRequest,
      searchResponse,
      searchResponseTotals,
      searchSamples,
      searchRequestStatus: SearchRequestStatus.Loaded,
      previousQuery: searchRequest.query,
      facets: this.getFacetsFromResponse(searchRequest, searchResponse),
    };

    await this.renderSeo(result);

    return result;
  }

  private shouldRedirectOnEmptyResults({
    searchRequest,
    searchResponseTotals,
    searchRequestStatus,
  }: Partial<SearchResultsControllerStoreState>) {
    if (
      !searchRequest ||
      !searchResponseTotals ||
      searchRequestStatus === SearchRequestStatus.Failed ||
      searchRequest.documentType === SearchDocumentType.All
    ) {
      return false;
    }

    const hasAnyResults = Object.values(searchResponseTotals).some(
      (value) => value,
    );

    const locationParams = this.getSearchRequestParamsFromLocation();
    const hasSelectedTabResults =
      !!searchResponseTotals[locationParams.documentType!];

    return hasAnyResults && !hasSelectedTabResults;
  }

  private getRedirectTargetDocumentType(
    visibleDocumentTypes: SearchDocumentType[],
  ) {
    return visibleDocumentTypes[0];
  }

  private redirectOnEmptyResults({
    searchRequest,
    visibleDocumentTypes,
  }: {
    searchRequest?: ISearchRequest;
    visibleDocumentTypes: SearchDocumentType[];
  }) {
    this.state.searchRequest = searchRequest!;

    const targetDocumentType =
      this.getRedirectTargetDocumentType(visibleDocumentTypes);

    this.changeDocumentType(targetDocumentType);
  }

  private async changeSearchRequest(
    searchRequest: ISearchRequest,
    reloadVisibleDocumentTypes = false,
  ): Promise<void> {
    const previousSearchRequestStatus = this.state.searchRequestStatus;

    this.setState({
      searchRequestStatus: SearchRequestStatus.Loading,
    });

    try {
      const partialState = await this.search(
        searchRequest,
        previousSearchRequestStatus,
        reloadVisibleDocumentTypes,
      );

      if (this.shouldRedirectOnEmptyResults(partialState)) {
        this.redirectOnEmptyResults(partialState);
      }

      this.setState({
        ...partialState,
        // This part adds a flag to props on which widget determines if it needs to perform scroll to itself
        // Alternative way was to add it in setState method itself so value would be in sync with local storage all the time
        // But that approach introduces some bugs
        // We need to perform scroll after widget data is loaded because only after that we know correct position to scroll to
        scrollToWidget: this.getScrollToWidget(),
      });
    } catch (error) {
      this.handleError(error);
    }
  }

  private readonly changeSearchRequestLazy: (request: ISearchRequest) => void =
    debounce(this.changeSearchRequest, 500);

  updateSettings(appSettings = this.state.appSettings) {
    const itemsPerPage = this.flowAPI.settings.get(settingsParams.itemsPerPage);
    const prevCategoryList = this.state.appSettings.categoryList;

    this.setState({ appSettings });

    if (!isMatch(prevCategoryList, appSettings.categoryList)) {
      this.changeSearchRequest(
        { ...this.state.searchRequest, documentType: undefined },
        true,
      );
    } else if (itemsPerPage !== this.prevItemsPerPage) {
      this.changeSearchRequestLazy({
        ...this.state.searchRequest,
        paging: {
          page: 1,
          pageSize: itemsPerPage,
        },
      });
      this.prevItemsPerPage = itemsPerPage;
    }
  }

  private applySearchRequest(
    searchRequest: ISearchRequest,
    disableScrollToTop?: boolean,
  ) {
    if (
      this.state.isDemoContent ||
      equalSearchRequests(this.state.searchRequest, searchRequest)
    ) {
      this.changeSearchRequest(searchRequest);
      return;
    }

    if (!searchRequest.filter) {
      this.state.facetFilters = {};
    }

    this.searchLocation.navigateToSearchResults(
      this.searchLocation.toLocationSearchRequest(
        searchRequest,
        this.state.facetFilters,
      ),
      { disableScrollToTop },
    );
  }

  private changeDocumentType = (
    documentType: SearchDocumentType,
    disableScrollTop?: boolean,
  ) => {
    const { searchRequest } = this.state;
    this.applySearchRequest(
      {
        ...searchRequest,
        documentType,
        filter: undefined,
        ordering: undefined,
        paging: {
          ...searchRequest.paging,
          page: 1,
        },
      },
      disableScrollTop,
    );
  };

  private changeQuery = (query: string) => {
    const { searchRequest } = this.state;

    this.state.facetFilters = {};

    this.applySearchRequest(
      {
        ...searchRequest,
        query,
        filter: undefined,
        paging: {
          ...searchRequest.paging,
          page: 1,
        },
      },
      true,
    );
  };

  private extractCurrencyFromSamples(
    searchSamples: ISearchSample[],
  ): string | undefined {
    const productSamples = (searchSamples.find(
      ({ documentType }) => documentType === SearchDocumentType.Products,
    )?.documents ?? []) as ISearchProductDocument[];

    return productSamples.length > 0 ? productSamples[0].currency : undefined;
  }

  updateDemoMode(data: { shouldHaveSearchResults: boolean }) {
    const { shouldHaveSearchResults } = data;
    const { searchRequest } = this.state;
    let isDemoContentOptionsChanged = false;

    if (
      shouldHaveSearchResults !==
      this.demoContentOptions.shouldHaveSearchResults
    ) {
      this.setDemoContentOptions({
        shouldHaveSearchResults,
      });

      isDemoContentOptionsChanged = true;
    }

    if (isDemoContentOptionsChanged) {
      this.applySearchRequest(searchRequest);
    }
  }

  private readonly handleDocumentTypeChange: ISearchResultsControllerProps['onDocumentTypeChange'] =
    (documentType, documentTypeChangeSource) => {
      try {
        const { environment } = this.flowAPI;
        this.sessionStore.set(
          SessionStoreKey.BiSearchOrigin,
          BiSearchOrigin.TabChange,
        );

        if (
          documentTypeChangeSource === DocumentTypeChangeSource.ViewAllButton
        ) {
          this.sessionStore.set(
            SessionStoreKey.ScrollToWidget,
            ScrollToWidget.Scroll,
          );
        }

        this.flowAPI.bi?.report(
          documentTypeChange({
            isDemo: this.state.isDemoContent,
            target: this.state.searchRequest.query,
            correlationId: this.getBiSearchCorrelationId(),
            tabName: documentType,
            source:
              documentTypeChangeSource ===
              DocumentTypeChangeSource.ViewAllButton
                ? 'samples'
                : 'tabs',
          }),
        );

        this.changeDocumentType(
          documentType,
          !environment.isEditorX ||
            documentTypeChangeSource === DocumentTypeChangeSource.Tab,
        );
      } catch (error) {
        reportError(this.flowAPI.errorMonitor, error);
      }
    };

  private readonly handleQuerySubmit: ISearchResultsControllerProps['onQuerySubmit'] =
    (query) => {
      try {
        const correlationId = createBiCorrelationId();

        this.sessionStore.set(
          SessionStoreKey.BiSearchCorrelation,
          correlationId,
        );
        this.sessionStore.set(
          SessionStoreKey.BiSearchOrigin,
          BiSearchOrigin.ResultPageSearchBar,
        );

        this.flowAPI.bi?.report(
          searchSubmit({
            isDemo: this.state.isDemoContent,
            target: query,
            correlationId,
          }),
        );

        this.changeQuery(query);
      } catch (error) {
        reportError(this.flowAPI.errorMonitor, error);
      }
    };

  private readonly handlePageChange: ISearchResultsControllerProps['onPageChange'] =
    (selectedPage) => {
      const { searchRequest } = this.state;
      const { environment } = this.flowAPI;

      try {
        this.sessionStore.set(
          SessionStoreKey.BiSearchOrigin,
          BiSearchOrigin.PageChange,
        );

        this.sessionStore.set(
          SessionStoreKey.ScrollToWidget,
          ScrollToWidget.Scroll,
        );

        this.applySearchRequest(
          {
            ...searchRequest,
            paging: {
              ...searchRequest.paging,
              page: selectedPage,
            },
          },
          !environment.isEditorX,
        );
      } catch (error) {
        reportError(this.flowAPI.errorMonitor, error);
      }
    };

  private readonly handleDocumentClick: ISearchResultsControllerProps['onDocumentClick'] =
    (searchDocument, index, clickOrigin) => {
      const { searchRequest } = this.state;

      try {
        this.logBiDocumentClick({
          documentId: searchDocument.id,
          documentType: searchDocument.documentType,
          pageUrl: searchDocument.url,
          resultClicked: searchDocument.title,
          searchIndex: getAbsoluteDocumentIndex(searchRequest.paging, index),
          clickOrigin,
        });
        this.wixCodeApi.location.to?.(searchDocument.relativeUrl);
      } catch (error) {
        reportError(this.flowAPI.errorMonitor, error);
      }
    };

  private readonly handleSortChange: ISearchResultsControllerProps['onSortChange'] =
    (selectedSortOption) => {
      if (selectedSortOption === this.state.selectedSortOption) {
        return;
      }

      try {
        const { searchRequest } = this.state;

        this.sessionStore.set(
          SessionStoreKey.BiSearchOrigin,
          BiSearchOrigin.Sort,
        );
        this.setState({ selectedSortOption });
        this.applySearchRequest(
          this.withOrdering({
            ...searchRequest,
            paging: {
              ...searchRequest.paging,
              page: 1,
            },
          }),
          true,
        );
      } catch (error) {
        reportError(this.flowAPI.errorMonitor, error);
      }
    };

  private readonly handleProductAddToCart: ISearchResultsControllerProps['onProductAddToCart'] =
    async (product) => {
      try {
        this.logBiDocumentClick({
          clickOrigin: 'add_to_cart',
          documentId: product.id,
          documentType: product.documentType,
        });
        await addProductToCart(product, this.wixCodeApi);
      } catch (error) {
        reportError(this.flowAPI.errorMonitor, error);
      }
    };

  private readonly handleFacetsFilterReset = () => {
    try {
      this.sessionStore.set(
        SessionStoreKey.BiSearchOrigin,
        BiSearchOrigin.ClearFacets,
      );
      this.logBiClickResetFacets();
      const resetFilter = Object.keys(this.state.facetFilters).reduce(
        (filter, key) => {
          return { ...filter, [key]: undefined };
        },
        {},
      );
      this.changeFacetFilters(resetFilter);
    } catch (error) {
      reportError(this.flowAPI.errorMonitor, error);
    }
  };

  private readonly handleFacetsFilterChange: OnFacetChangeFn = (
    updatedFacetsFilter,
  ) => {
    try {
      this.sessionStore.set(
        SessionStoreKey.BiSearchOrigin,
        BiSearchOrigin.Facets,
      );
      this.changeFacetFilters(updatedFacetsFilter);
    } catch (error) {
      reportError(this.flowAPI.errorMonitor, error);
    }
  };

  private readonly changeFacetFilters: OnFacetChangeFn = (
    updatedFacetsFilter,
  ) => {
    const { searchRequest, facetFilters } = this.state;

    this.setState({
      facetFilters: {
        ...facetFilters,
        ...updatedFacetsFilter,
      },
    });

    this.applySearchRequest(
      this.withGenericFacets({
        ...searchRequest,
        paging: {
          ...searchRequest.paging,
          page: 1,
        },
      }),
      true,
    );
  };

  private withGenericFacets = (
    searchRequest: ISearchRequest,
  ): ISearchRequest => {
    let apiFacets = {} as FacetApiDescriptors;
    if (searchRequest.documentType) {
      const facetDescriptors = getFacetDescriptorsByDocumentType(
        searchRequest.documentType,
      );
      if (facetDescriptors) {
        apiFacets = convertFacetDescriptorsToApiFacets(facetDescriptors);
      }
    }
    const facetFilters = convertFacetsFilterToRequestParams(
      this.state.facetFilters,
      searchRequest.documentType,
    );
    return {
      ...searchRequest,
      ...apiFacets,
      ...(facetFilters ? { filter: facetFilters } : undefined),
    };
  };

  private withOrdering = (searchRequest: ISearchRequest): ISearchRequest => {
    const previousDocumentType = this.state.searchRequest.documentType;

    if (
      searchRequest.documentType !== previousDocumentType &&
      previousDocumentType !== SearchDocumentType.All
    ) {
      this.state.selectedSortOption = DEFAULT_SORT_OPTION;
    }

    return {
      ...searchRequest,
      ordering: getOrdering(
        searchRequest.documentType,
        this.state.selectedSortOption,
      ),
    };
  };

  private getEmptyResponseStateProps(): Pick<
    SearchResultsControllerStoreState,
    | 'searchResponseTotals'
    | 'searchSamples'
    | 'searchResponse'
    | 'visibleDocumentTypes'
  > {
    return {
      searchResponseTotals: {},
      searchSamples: [],
      searchResponse: {
        documents: [],
        facets: [],
        totalResults: 0,
      },
      visibleDocumentTypes: [],
    };
  }

  private getErrorStateProps() {
    return {
      ...this.getEmptyResponseStateProps(),
      apiErrorDetails: undefined,
      previousQuery: undefined,
      searchRequestStatus: SearchRequestStatus.Failed,
    };
  }

  private logBiClickResetFacets() {
    // 99:307 SearchResults - Click Reset Facets
    // https://bo.wix.com/bi-catalog-webapp/#/sources/99/events/307?artifactId=com.wixpress.wix-search-widget
    this.flowAPI.bi?.report(
      searchResultsClickResetFacets({
        availableFacets: getBiAvailableFacets(
          this.state.searchRequest,
          this.state.searchResponse,
        ),
        clickOrigin: 'empty_result_page',
        correlationId: this.getBiSearchCorrelationId(),
        selectedFacets: getBiSelectedFacets(this.state.searchRequest),
        target: this.state.searchRequest.query,
        isDemo: this.state.isDemoContent,
      }),
    );
  }

  private logBiDocumentClick(
    params: Pick<
      BiDocumentClickParams,
      | 'documentId'
      | 'documentType'
      | 'pageUrl'
      | 'searchIndex'
      | 'resultClicked'
    > & { clickOrigin: DocumentClickOrigin },
  ): void {
    const { isDemoContent, searchResponseTotals } = this.state;
    // 99:305 searchResults.results.click
    // https://bo.wix.com/bi-catalog-webapp/#/sources/99/events/305?artifactId=com.wixpress.wix-search-widget
    this.flowAPI.bi?.report(
      documentClick({
        correlationId: this.getBiSearchCorrelationId(),
        isDemo: isDemoContent,
        resultsArray: getBiTotals(searchResponseTotals),
        target: this.state.searchRequest.query,
        ...params,
      }),
    );
  }

  private redirectOnInvalidPageRequest() {
    const { searchRequest, searchResponse } = this.state;
    const { pageSize, page } = searchRequest.paging;
    const totalPages = getTotalPages(pageSize, searchResponse.totalResults);

    if (totalPages && page > totalPages) {
      this.applySearchRequest({
        ...searchRequest,
        paging: {
          ...searchRequest.paging,
          page: 1,
        },
      });
    }
  }

  private async redirectFromPathParams(): Promise<void> {
    const pathParams = this.searchLocation.decodeParamsFromPath();
    if (!Object.keys(pathParams).length) {
      return;
    }

    await this.searchLocation.navigateToSearchResults({
      ...this.getSearchRequestParamsFromLocation(),
      ...pathParams,
    });
  }

  private async renderSeo({
    searchRequest,
    searchSamples,
    searchResponse,
  }: Pick<
    SearchResultsControllerStoreState,
    'searchRequest' | 'searchSamples' | 'searchResponse'
  >) {
    const resultType = searchRequest.documentType;
    const searchTerm = searchRequest.query;
    if (searchTerm.length === 0) {
      return;
    }
    const documents =
      resultType === SearchDocumentType.All
        ? searchSamples
        : searchResponse.documents;

    const baseResultsPageUrl =
      await this.searchLocation.getSearchResultsAbsoluteUrl();
    const allResultsUrl = this.searchLocation.buildSearchResultsUrl(
      baseResultsPageUrl,
      {
        query: searchTerm,
      },
    );

    const itemData: ISeoItemData = {
      allResultsUrl,
      documents,
      pageUrl: this.wixCodeApi.location.url,
      resultsTotal: searchResponse.totalResults,
      resultType,
      searchTerm,
    };

    this.wixCodeApi.seo.renderSEOTags({
      itemType: ITEM_TYPES.SEARCH_PAGE,
      itemData,
    });
  }

  private handleError(error: unknown) {
    this.setState(this.getErrorStateProps());
    reportError(this.flowAPI.errorMonitor, error);
  }

  public setProductsWidgetCallBacks({
    productsSlot,
  }: {
    productsSlot: SlotContentSDKProxy;
  }) {
    productsSlot.setExternalDataSourceCallbacks({
      getProducts: async (req: Partial<ISearchRequest>) => {
        this.state.searchRequest.filter = req.filter;
        // this.state.searchRequest.sort = req.sort;

        const res = await this.search(
          this.state.searchRequest,
          this.state.searchRequestStatus,
          true,
        );

        const productsResponse = {
          totalCount: res.searchResponse.totalResults,
          list: res.searchResponse.documents,
        };

        return Promise.resolve(productsResponse as any);
      },
      getFiltersMetadata: () => Promise.resolve([] as any),
    });
  }

  async setInitialState(shouldContainProductWidget: boolean): Promise<void> {
    try {
      await this.redirectFromPathParams();

      // Search correlation ID might be missing (e.g. by direct visit)
      if (!this.sessionStore.has(SessionStoreKey.BiSearchCorrelation)) {
        this.sessionStore.set(
          SessionStoreKey.BiSearchCorrelation,
          createBiCorrelationId(),
        );
      }

      const [appSettings, searchResultsAbsoluteUrl] = await Promise.all([
        this.getAppSettings(),
        this.searchLocation.getSearchResultsAbsoluteUrl(),
      ]);
      this.state.appSettings = appSettings;

      let partialState = await this.search(
        this.state.searchRequest,
        this.state.searchRequestStatus,
        true,
      );

      if (this.shouldRedirectOnEmptyResults(partialState)) {
        const redirectDocumentType = this.getRedirectTargetDocumentType(
          partialState.visibleDocumentTypes,
        );

        partialState = await this.search(
          {
            ...this.state.searchRequest,
            documentType: redirectDocumentType,
          },
          this.state.searchRequestStatus,
        );

        const { environment } = this.flowAPI;
        if (!environment.isSSR) {
          this.redirectOnEmptyResults(partialState);
        }
      }

      this.setState({
        searchResultsAbsoluteUrl,
        shouldContainProductWidget,
        ...partialState,
      });

      if (this.state.searchRequestStatus !== SearchRequestStatus.Failed) {
        this.redirectOnInvalidPageRequest();
      }
    } catch (error) {
      this.handleError(error);
    }
  }
}
