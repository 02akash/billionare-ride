import { createSettingsParams, SettingsParamType } from '@wix/tpa-settings';
import { Spec } from '@wix/site-search-common';

export enum Alignment {
  Left = 'left',
  Center = 'center',
  Right = 'right',
}

export type ISettingsParams = {
  isSearchBarEnabled: SettingsParamType.Boolean;
  searchBarPlaceholder: SettingsParamType.Text;
  itemsPerPage: SettingsParamType.Number;
  isResultsMessageWithQuery: SettingsParamType.Boolean;
  isResultsMessageWithNumber: SettingsParamType.Boolean;
  isResultsEmptyMessageWithNumber: SettingsParamType.Boolean;
  isResultsEmptyMessageWithQuery: SettingsParamType.Boolean;
  resultsMenuAlignment: SettingsParamType.String;
  paginationAlignment: SettingsParamType.String;
  isProductsAddToCartEnabled: SettingsParamType.Boolean;
  productsAddToCartButtonText: SettingsParamType.String;
  isProductsFacetsEnabled: SettingsParamType.Boolean;
  isForumsFacetsEnabled: SettingsParamType.Boolean;
};

export default createSettingsParams<ISettingsParams>({
  isSearchBarEnabled: {
    key: 'isSearchBarEnabled',
    getDefaultValue({ isMobile, experiments }) {
      return experiments.enabled(Spec.MobileSettings) && isMobile
        ? false
        : true;
    },
  },
  searchBarPlaceholder: {
    key: 'searchBarPlaceholder',
    getDefaultValue({ t }) {
      return t('settings.searchBar.placeholderInput.defaultValue');
    },
  },
  itemsPerPage: {
    key: 'itemsPerPage',
    getDefaultValue({ experiments }) {
      return experiments.enabled(Spec.NewResultsPerPageDefaultValue) ? 12 : 10;
    },
  },
  isResultsMessageWithQuery: {
    key: 'isResultsMessageWithQuery',
    getDefaultValue() {
      return true;
    },
  },
  isResultsMessageWithNumber: {
    key: 'isResultsMessageWithNumber',
    getDefaultValue() {
      return true;
    },
  },
  isResultsEmptyMessageWithNumber: {
    key: 'appLayout',
    getDefaultValue() {
      return false;
    },
  },
  isResultsEmptyMessageWithQuery: {
    key: 'isResultsEmptyMessageWithQuery',
    getDefaultValue() {
      return false;
    },
  },
  resultsMenuAlignment: {
    key: 'resultsMenuAlignment',
    getDefaultValue({ isRTL }) {
      return isRTL ? Alignment.Right : Alignment.Left;
    },
  },
  paginationAlignment: {
    key: 'paginationAlignment',
    getDefaultValue() {
      return Alignment.Center;
    },
  },
  isProductsAddToCartEnabled: {
    key: 'isProductsAddToCartEnabled',
    getDefaultValue() {
      return true;
    },
  },
  productsAddToCartButtonText: {
    key: 'productsAddToCartButtonText',
    getDefaultValue({ t }) {
      return t('settings.display.products.addToCart.buttonText');
    },
  },
  isProductsFacetsEnabled: {
    key: 'isProductsFacetsEnabled',
    getDefaultValue() {
      return true;
    },
  },
  isForumsFacetsEnabled: {
    key: 'isForumsFacetsEnabled',
    getDefaultValue() {
      return true;
    },
  },
});
