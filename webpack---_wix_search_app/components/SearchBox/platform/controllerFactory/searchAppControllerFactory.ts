import { debounce } from 'lodash';
import { AppSettings } from '@wix/search-settings-client';

import { ControllerFactory } from '../../../../lib/platform.types';
import { createSearchPlatformBiLogger } from '../bi';
import { convertResponseToTrendingItems } from './convertResponseToTrendingItems';
import {
  ISearchBoxWixCodeEvent,
  I$WResult,
  ISearchBoxWixCode,
  FederatedSuggestions,
} from '@wix/site-search-common';
import { suggestAutocompleteValue } from './suggestAutocompleteValue';
import { reportError } from '../../../../lib/errors';
import { SessionStore, SessionStoreKey } from '../../../../lib/sessionStore';
import { ScrollToWidget } from '../../../../lib/scrollToWidget';
import { loadSuggestions } from './loadSuggestions';

const DEBOUNCE_DELAY_SUGGESTIONS = 100;
const DEBOUNCE_DELAY_AUTOCOMPLETE = 100;

export const searchAppControllerFactory: ControllerFactory = async ({
  getAppSettings,
  platformAPIs,
  searchLocation,
  searchSDK,
  wixCodeApi,
  flowAPI,
  $w,
}) => {
  const { formFactor, viewMode } = wixCodeApi.window;
  const isMobile = formFactor === 'Mobile';
  const isSiteViewMode = viewMode === 'Site';
  const isDemoContent = !isSiteViewMode;
  const { experiments, errorMonitor, environment, bi, translations } = flowAPI;
  const sessionStore = new SessionStore(platformAPIs);
  const isOnSearchResultsPage = () =>
    wixCodeApi.site.currentPage?.applicationId === environment.appDefinitionId;

  const closeSuggestions = (searchBox: ISearchBoxWixCode) => {
    searchBox.suggestions = null;
    if (isMobile) {
      searchBox.closeSuggestions();
      searchBox.suggestionsLoading = false;
    }
  };

  const closeSuggestionsOnNavigation = (
    searchBox: ISearchBoxWixCode,
    suggestionUrl = '',
  ) => {
    if (!searchBox.suggestionsEnabled) {
      return;
    }

    // Regular desktop suggestions
    if (!isMobile) {
      closeSuggestions(searchBox);
      return;
    }

    // With mobile modal suggestions we use a loader/spinner to show progress for navigation
    // triggered from the modal. As a result there are cases where we do not manually close the
    // modal, but instead show a loader (and leave it to be closed by viewer navigation).
    // This is done to improve UX for users with slow network connection. Ideally some kind of
    // navigation loader should be provided by viewer platform in the future.

    searchBox.suggestionsLoading = true;

    // When clicking on suggestion make sure to close the modal immediately if navigating to a
    // link the user is already on (e.g. clicking on "Home" suggestion when already on homepage).
    if (suggestionUrl) {
      const { path, baseUrl } = wixCodeApi.location;
      const currentUrl = `${baseUrl}/${path.join('/')}`.replace(/\/+$/, '');

      if (currentUrl === suggestionUrl) {
        closeSuggestions(searchBox);
      }
    } else {
      if (isOnSearchResultsPage()) {
        closeSuggestions(searchBox);
      }
    }
  };

  const suggestAutocompleteValueDebounced = debounce(
    suggestAutocompleteValue,
    DEBOUNCE_DELAY_AUTOCOMPLETE,
  );

  const biLogger = createSearchPlatformBiLogger(platformAPIs, bi!);

  function getRelativeUrl(url: string): string {
    const relativeUrl = url.replace(wixCodeApi.location.baseUrl, '');
    return relativeUrl === '' ? '/' : relativeUrl;
  }

  function getQueryFromLocation() {
    return isOnSearchResultsPage() ? wixCodeApi.location.query.q : '';
  }

  function checkCorrelationId(searchQuery: string) {
    if (!searchQuery) {
      biLogger.trendingItemsCorrelationId = biLogger.suggestionsCorrelationId;
      biLogger.resetCorrelationId();
    } else {
      biLogger.trendingItemsCorrelationId = undefined;
    }
  }

  return {
    async pageReady() {
      const searchBoxes: I$WResult<ISearchBoxWixCode> = $w('@searchBox');
      const hasSearchBoxOnPage = searchBoxes.length > 0;

      if (!hasSearchBoxOnPage) {
        return;
      }
      if (isOnSearchResultsPage()) {
        searchBoxes.value = getQueryFromLocation();
      }

      let appSettingsPromise: Promise<AppSettings> | undefined;

      const shouldUseAutocomplete = !isDemoContent;

      const shouldShowTrending = !isDemoContent;

      let trendingItems: FederatedSuggestions | undefined;

      wixCodeApi.location.onChange(() => {
        if (isOnSearchResultsPage()) {
          searchBoxes.value = getQueryFromLocation();
        }
        closeSuggestions(searchBoxes);
      });

      searchBoxes.onClear(({ previousValue }) => {
        try {
          biLogger.trendingItemsCorrelationId =
            biLogger.suggestionsCorrelationId;
          biLogger.resetCorrelationId();
          biLogger.searchBoxCleared({
            isDemo: isDemoContent,
            searchQuery: previousValue,
          });
        } catch (error) {
          reportError(errorMonitor, error);
        }
      });

      searchBoxes.onSubmit(({ target: searchBox }) => {
        try {
          const disableScrollToTop = !environment.isEditorX;

          const searchQuery = searchBox.value;

          sessionStore.set(
            SessionStoreKey.ScrollToWidget,
            ScrollToWidget.CheckViewportAndScroll,
          );

          biLogger.searchSubmit({
            isDemoContent,
            searchQuery,
          });

          closeSuggestionsOnNavigation(searchBox);

          searchLocation.navigateToSearchResults(
            {
              query: isSiteViewMode ? searchQuery : '',
            },
            {
              disableScrollToTop: isOnSearchResultsPage()
                ? disableScrollToTop
                : false,
            },
          );
        } catch (error) {
          reportError(errorMonitor, error);
        }
      });

      searchBoxes.onFocus(({ target: searchBox }) => {
        try {
          const shouldOpenModalSuggestions =
            !isDemoContent && isMobile && searchBox.suggestionsEnabled;

          biLogger.searchBoxFocused({
            isDemo: isDemoContent,
            isFullscreen: shouldOpenModalSuggestions,
          });

          if (shouldOpenModalSuggestions) {
            searchBox.openSuggestions();
          }
        } catch (error) {
          reportError(errorMonitor, error);
        }
      });

      searchBoxes.onChange(async ({ target: searchBox, previousValue }) => {
        try {
          const { value } = searchBox;

          if (!previousValue && value.length > 0) {
            biLogger.searchBoxStartedWritingAQuery({
              isDemo: isDemoContent,
            });
          }

          if (value && shouldUseAutocomplete && searchBox.autocompleteEnabled) {
            if (!appSettingsPromise) {
              appSettingsPromise = getAppSettings();
            }

            const appSettings = await appSettingsPromise;

            await suggestAutocompleteValueDebounced({
              searchBox,
              appSettings,
              searchSDK,
              biLogger,
            });
          }
        } catch (error) {
          reportError(errorMonitor, error);
        }
      });

      if (shouldUseAutocomplete) {
        searchBoxes.onAutocomplete(({ target: searchBox, previousValue }) => {
          try {
            biLogger.searchBoxAutoCompleteShownSuggestionApproved({
              searchQuery: searchBox.value,
              previousQuery: previousValue,
            });
          } catch (error) {
            reportError(errorMonitor, error);
          }
        });
      }

      searchBoxes.onFocus(async ({ target: searchBox }) => {
        if (!searchBox.suggestionsEnabled && !searchBox.autocompleteEnabled) {
          return;
        }

        const searchQuery = searchBox.value.trim();

        if (!appSettingsPromise) {
          appSettingsPromise = getAppSettings();
        }

        const biSearchBoxSuggestionsRequestFinished =
          biLogger.searchBoxSuggestionsRequestStarted({ searchQuery });

        try {
          const appSettings = await appSettingsPromise;

          const promises = [];

          if (
            searchQuery &&
            !searchBox.suggestions &&
            searchBox.suggestionsEnabled
          ) {
            const suggestionsPromise = loadSuggestions({
              searchBox,
              appSettings,
              biLogger,
              experiments,
              searchSDK,
              isMobile,
              searchLocation,
            });
            promises.push(suggestionsPromise);
          }

          if (shouldUseAutocomplete && searchBox.autocompleteEnabled) {
            const autocompletePromise = suggestAutocompleteValueDebounced({
              appSettings,
              biLogger,
              searchBox,
              searchSDK,
            });
            promises.push(autocompletePromise);
          }

          if (!promises.length) {
            return;
          }

          const [federatedSuggestions] = await Promise.all(promises);

          if (federatedSuggestions) {
            biSearchBoxSuggestionsRequestFinished({
              success: true,
              suggestions: federatedSuggestions.items,
            });
          }
        } catch (error) {
          biSearchBoxSuggestionsRequestFinished({
            success: false,
            error: String(error),
            suggestions: [],
          });

          reportError(errorMonitor, error);
        } finally {
          if (isMobile) {
            searchBox.suggestionsLoading = false;
          }
        }
      });

      if (shouldShowTrending) {
        searchBoxes.onFocus(async ({ target: searchBox }) => {
          if (
            !searchBox.suggestionsEnabled ||
            !searchBox.trendingItemsEnabled
          ) {
            return;
          }

          const searchQuery = searchBox.value.trim();

          if (searchQuery) {
            return;
          }

          const biSearchBoxTrendingItemsRequestFinished =
            biLogger.searchBoxTrendingItemsRequestStarted();

          try {
            if (!trendingItems) {
              if (!appSettingsPromise) {
                appSettingsPromise = getAppSettings();
              }

              if (isMobile) {
                searchBox.suggestionsLoading = true;
              }

              const appSettings = await appSettingsPromise;

              const trending = await searchSDK.getTrendingItems(
                { includeSeoHidden: appSettings.isSeoHiddenIncluded },
                { correlationId: biLogger.trendingItemsCorrelationId },
              );

              // FIXME: Yoshi missing translations issue workaround.
              try {
                await translations.init();
              } catch {}

              trendingItems = convertResponseToTrendingItems({
                appSettings,
                federatedResponse: trending,
                searchLocation,
                searchQuery,
                translate: translations.t,
                experiments,
              });
            }

            if (!searchBox.value.trim()) {
              searchBox.suggestions = trendingItems;
              biSearchBoxTrendingItemsRequestFinished({
                success: true,
                suggestions: trendingItems.items,
              });
            }
          } catch (error) {
            biSearchBoxTrendingItemsRequestFinished({
              success: false,
              error: String(error),
              suggestions: [],
            });

            reportError(errorMonitor, error);
          } finally {
            if (isMobile) {
              searchBox.suggestionsLoading = false;
            }
          }
        });
      }

      if (!isDemoContent) {
        const suggestionsDelay = DEBOUNCE_DELAY_SUGGESTIONS;

        searchBoxes.onChange(
          debounce(async ({ target: searchBox }: ISearchBoxWixCodeEvent) => {
            const searchQuery = searchBox.value.trim();
            checkCorrelationId(searchQuery);

            if (!searchBox.suggestionsEnabled) {
              return;
            }

            if (
              shouldShowTrending &&
              !searchQuery &&
              trendingItems &&
              searchBox.trendingItemsEnabled
            ) {
              const biSearchBoxTrendingItemsRequestFinished =
                biLogger.searchBoxTrendingItemsRequestStarted();
              searchBox.suggestions = trendingItems;
              biSearchBoxTrendingItemsRequestFinished({
                success: true,
                suggestions: trendingItems.items,
              });
              return;
            }

            if (isMobile && !searchQuery) {
              searchBox.suggestions = null;
              return;
            }

            if (!searchQuery.length && !isMobile) {
              closeSuggestions(searchBox);
              return;
            }

            const biSearchBoxSuggestionsRequestFinished =
              biLogger.searchBoxSuggestionsRequestStarted({ searchQuery });

            try {
              if (!appSettingsPromise) {
                appSettingsPromise = getAppSettings();
              }

              const appSettings = await appSettingsPromise;

              const federatedSuggestions = await loadSuggestions({
                searchBox,
                appSettings,
                biLogger,
                experiments,
                searchSDK,
                isMobile,
                searchLocation,
              });

              if (federatedSuggestions) {
                biSearchBoxSuggestionsRequestFinished({
                  success: true,
                  suggestions: federatedSuggestions.items,
                });
              }
            } catch (error) {
              biSearchBoxSuggestionsRequestFinished({
                success: false,
                error: String(error),
                suggestions: [],
              });

              reportError(errorMonitor, error);
            } finally {
              if (isMobile) {
                searchBox.suggestionsLoading = false;
              }
            }
          }, suggestionsDelay),
        );

        searchBoxes.onSuggestionSelect(({ target, syntheticEvent }) => {
          try {
            const searchBox = target;
            const { title, data } = syntheticEvent;
            const { url, query, globalIndex, groupId } = data;

            const biEventParams = {
              title,
              url,
              searchQuery: query,
              index: globalIndex,
              documentType: groupId,
              suggestions: searchBox.suggestions?.items || [],
            };

            const isTrendingItem =
              shouldShowTrending && trendingItems && !searchBox.value.trim();

            if (isTrendingItem) {
              biLogger.searchBoxTrendingItemClick(biEventParams);
            } else {
              biLogger.searchBoxSuggestionClick(biEventParams);
            }

            closeSuggestionsOnNavigation(searchBox, url);

            searchLocation.navigateTo(getRelativeUrl(url));
          } catch (error) {
            reportError(errorMonitor, error);
          }
        });

        searchBoxes.onSuggestionsFooterClick(async ({ target }) => {
          try {
            const searchBox = target;
            const query = searchBox.value;

            closeSuggestionsOnNavigation(searchBox);

            sessionStore.set(
              SessionStoreKey.ScrollToWidget,
              ScrollToWidget.CheckViewportAndScroll,
            );

            biLogger.searchBoxSuggestionSearchAllClick({ searchQuery: query });
            await searchLocation.navigateToSearchResults({ query });
          } catch (error) {
            reportError(errorMonitor, error);
          }
        });

        searchBoxes.onSuggestionGroupSelect(({ target, syntheticEvent }) => {
          try {
            /* SearchBox::Bolt does not use `onSuggestionGroupSelect`:
             * https://github.com/wix-private/wix-ui-santa/search?q=onSuggestionGroupSelect
             * https://github.com/wix-private/site-search/search?q=handleSuggestionGroupSelect
             *
             * However old implementation of API leaked to the users at least once.
             *
             * In Bolt implementation of SearchBox, fields (url, query, groupId) were defined
             * directly on `syntheticEvent` (without `data` layer).
             *
             * In SearchBox::TB we moved to unified solution and introduced `syntheticEvent.data`.
             *
             * This guard should help to avoid unexpected failures in the user code.
             */
            if (!syntheticEvent?.data) {
              return;
            }

            const searchBox = target;
            const { url, query, groupId } = syntheticEvent.data;

            closeSuggestionsOnNavigation(searchBox);

            sessionStore.set(
              SessionStoreKey.ScrollToWidget,
              ScrollToWidget.CheckViewportAndScroll,
            );

            biLogger.searchBoxSuggestionShowAllClick({
              searchQuery: query,
              documentType: groupId,
            });

            searchLocation.navigateTo(getRelativeUrl(url));
          } catch (error) {
            reportError(errorMonitor, error);
          }
        });
      }
    },
  };
};
