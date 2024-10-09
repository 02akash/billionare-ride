/* eslint-disable import/no-cycle */
import {APP_DEFINITION_ID} from '@wix/wixstores-client-core/dist/es/src/constants';

export const translationPath = (baseUrl, locale) => `${baseUrl}assets/locale/gallery/gallery_${locale}.json`;
export const DEFAULT_COLLECTION_ID = '00000000-000000-000000-000000000001';
export const TRACK_EVENT_COLLECTION = 'All Products';
export const BI_APP_NAME = 'galleryApp';
export const GALLERY_FEDOPS_APP_NAME = 'wixstores-gallery';
export const SLIDER_GALLERY_FEDOPS_APP_NAME = 'wixstores-slider-gallery';
export const FORCE_RELATED_GALLERY_RENDER_TIMEOUT = 500;
export const origin = 'gallery-page';
export const MAX_PRODUCTS = 10000;
export const MAX_PRODUCTS_BATCHING = 2000;
export const SLIDER_GALLERY_TYPE = 'slider-gallery';

export const DEFAULT_GALLERY_IMAGE_SIZE = 100;

export enum SLIDER_GALLERY_PRODUCTS_LOGICS_FOR_BI {
  RELATED_PRODUCTS = 'related products',
  COLLECTION = 'collection',
  ALL_PRODUCTS = 'All products',
  VELO = 'velo products',
  ALGORITHMS = 'algorithms',
}

export enum PAGE_NAMES_FOR_BI {
  HOME = 'home',
  CUSTOM_PAGE = 'custom_page',
}

export enum GALLERY_PUBLIC_DATA_PRESET_ID {
  COLLECTION = 'Wix_Store_Slider_Product_Gallery_1',
  RELATED_PRODUCTS = 'Wix_Store_Related_Product_Gallery_1',
}

export enum FilterAndSortButtonStyle {
  TEXT,
  BOX,
}

export interface IKeyboardEvent {
  keyCode: number;
  charCode: number;
}

export const keyboardEvents: {[key: string]: IKeyboardEvent} = {
  ENTER: {keyCode: 13, charCode: 13},
  SPACEBAR: {keyCode: 32, charCode: 32},
  ARROW_UP: {keyCode: 38, charCode: 38},
  ARROW_DOWN: {keyCode: 40, charCode: 40},
  ARROW_RIGHT: {keyCode: 39, charCode: 39},
  ARROW_LEFT: {keyCode: 37, charCode: 37},
};

export const MAX_COLS = 6;
export const MAX_ROWS = 12;
export const DEFAULT_COLS = 4;
export const DEFAULT_ROWS = 5;
export const DEFAULT_MOBILE_PRODUCTS_COUNT = 10;
export const DEFAULT_AUTO_GRID_PRODUCTS_COUNT = 24;
export const DEFAULT_MANUAL_GRID_PRODUCTS_COUNT = DEFAULT_COLS * DEFAULT_ROWS;
export const DEFAULT_PRODUCT_IMAGE_SIZE = 240;
export const BATCH_MAX_SIZE = 100;

export enum Experiments {
  ClientGalleryArrowlessMobileSlider = 'specs.stores.ClientGalleryArrowlessMobileSlider',
  GalleryProductOptionsVisibilitySettings = 'specs.stores.GalleryProductOptionsVisibilitySettings',
  AllowGalleryProductRoundCornersInViewer = 'specs.stores.AllowGalleryProductRoundCornersInViewer',
  GalleryProductOptionsAndQuantityRoundCornersInViewer = 'specs.stores.GalleryProductOptionsAndQuantityRoundCornersInViewer',
  UseNewFiltersQueryParamEncoder = 'specs.stores.UseNewFiltersQueryParamEncoder',
  UseNewFiltersQueryParamDecoder = 'specs.stores.UseNewFiltersQueryParamDecoder',
  GalleryProductItemCarouselHover = 'specs.stores.GalleryProductItemCarouselHover',
  SliderGalleryInEditorXViewer = 'specs.stores.SliderGalleryInEditorXViewer',
  EditableGridTemplateRepeatOption = 'specs.stores.GalleryEditableGridTemplateRepeatOption',
  EditorGalleryOOI = 'specs.stores.EditorGalleryOOI',
  FixGalleryRenderingWhenUrlChanges = 'specs.stores.FixGalleryRenderingWhenUrlChanges',
  FixGalleryNotToShowQueryPageFor1 = 'specs.stores.FixGalleryNotToShowQueryPageFor1',
  ShouldUseCommonDiscountPricingMethods = 'specs.stores.ShouldUseCommonDiscountPricingMethods',
  FixSliderGalleryTextSettingToChangeOnEditor = 'specs.stores.FixSliderGalleryTextSettingToChangeOnEditor',
  ClearFiltersInASingleCall = 'specs.stores.GalleryClearFiltersInASingleCall',
  DisableInfiniteScrollInEditor = 'specs.stores.disableInfiniteScrollInEditorGridGallery',
  ShouldResetQuantityUponSelectionChange = 'specs.stores.GalleryProductItemResetQuantityUponSelectionChange',
  FixQuickViewForSubscriptionsInWishlist = 'specs.stores.FixQuickViewForSubscriptionsInWishlist',
  RenderSlotsInGallery = 'specs.stores.RenderSlotsInGallery',
  HideArrowsOnSliderGalleryWithFewerProductsThanColumns = 'specs.stores.HideArrowsOnSliderGalleryWithFewerProductsThanColumns',
  SliderGalleryInfiniteLoopToggleViewer = 'specs.stores.SliderGalleryInfiniteLoopToggleViewer',
  SliderGalleryFixSwiperIndex = 'specs.stores.SliderGalleryFixSwiperIndex',
  EnableQualityOptionsStylingChanges = 'specs.stores.EnableQualityOptionsStylingChanges',
  ColorOptionsDefaultSizeViewer = 'specs.stores.ColorOptionsDefaultSizeViewer',
  GalleryProductOptionsLimit = 'specs.stores.GalleryProductOptionsLimit',
  EnableFadeInAnimationOnGalleryScroll = 'specs.stores.EnableFadeInAnimationOnGalleryScroll',
  AllowStickySidebarInViewer = 'specs.stores.AllowStickySidebarInViewer',
  EnableDynamicSizeDefaultImage = 'specs.stores.EnableDynamicSizeDefaultImage',
  SliderGallery200Limit = 'specs.stores.SliderGallery200Limit',
  FixDropdownOptionsDisabledOpacity = 'specs.stores.FixGalleryDropdownOptionsDisabledOpacity',
  SliderGalleryDisableThrowOnA11yInitErrors = 'specs.stores.SliderGalleryDisableThrowOnA11yInitErrors',
  GalleryAllowLinkToProductPageInSSR = 'specs.stores.GalleryAllowLinkToProductPageInSSR',
  ShouldUseEcomPlatformPublicApiAddToCartInGallery = 'specs.stores.ShouldUseEcomPlatformPublicApiAddToCartInGallery',
  AllowAddToCartButtonOnImageInViewer = 'specs.stores.AllowAddToCartButtonOnImageInViewer',
  AllowAddToCartButtonContentTypesInViewer = 'specs.stores.AllowAddToCartButtonContentTypesInViewer',
  GalleryA11yFixes = 'specs.stores.GalleryA11yFixes',
  ShouldRemoveModifiersSelectionIdsFromUserSelections = 'specs.stores.RemoveModifiersSelectionIdsFromUserSelections',
  ShouldShowNamePriceSideBySideInViewer = 'specs.stores.GalleryShowNamePriceSideBySideInViewer',
  GetCurrentCategorySeparately = 'specs.stores.GetCurrentCategorySeparately',
  NewCategoryList = 'specs.stores.NewCategoryList',
  SendNewV3SeoData = 'specs.stores.SendNewV3SeoData',
  EnableDiscountAndRegularPriceSwapViewer = 'specs.stores.EnableDiscountAndRegularPriceSwapViewer',
  EnableOutOfStockAlignment = 'specs.stores.EnableOutOfStockAlignment',
  AddMobileClassesToSliderGalleryRoot = 'specs.stores.AddMobileClassesToSliderGalleryRoot',
  ShouldUseEcomPlatformPublicApiAddToCartInPP = 'specs.stores.ShouldUseEcomPlatformPublicApiAddToCartInPP',
  ShouldInstallSideCart = 'specs.stores.ShouldInstallSideCart',
  ShouldPreloadCurrentCart = 'specs.stores.ShouldPreloadCurrentCart',
  ShouldUseSideCart = 'specs.stores.ShouldUseSideCart',
  EnableLoadableGallery = 'specs.stores.EnableGalleryLoadable',
  OptimizeSelectionCalculation = 'specs.stores.OptimizeSelectionCalculation',
  GalleryProductItemsLazyLoadingForV3 = 'specs.stores.GalleryProductItemsLazyLoadingForV3',
  CategoryPageShowTaxonimicalBreadcrumbs = 'specs.stores.ShowTaxonomicalBreadcrumbsInCategoryPage',
  GalleryRemoveOldColorPickerTextFont = 'specs.stores.GalleryRemoveOldColorPickerTextFont',
}

export enum FedopsInteraction {
  Filter = 'gallery-filter',
  MobileFilter = 'gallery-mobile-filter',
  Sort = 'gallery-sort',
  AddToCart = 'add-to-cart-from-gallery',
  LoadMore = 'load-more',
  Pagination = 'pagination',
  InfiniteScroll = 'infinite',
}

export enum BiEventParam {
  LoadMore = 'button',
  Pagination = 'pagination',
  InfiniteScroll = 'infinite',
}

export enum TrackEvents {
  AddToCart = 'AddToCart',
  ViewContent = 'ViewContent',
}

export enum AddToCartActionStatus {
  IDLE = 0,
  SUCCESSFUL = 1,
  FAILED = 2,
  IN_PROGRESS = 3,
}

export const trackEventMetaData = {
  appDefId: APP_DEFINITION_ID,
  category: 'All Products',
  origin: 'Stores',
} as const;

export const ProductOptionsDiplayLimit = {
  totalLimit: 2,
  colorPickersLimit: 1,
} as const;

const STORES_ALGORITHMS_APP_ID = '215238eb-22a5-4c36-9e7b-e7c08025e04e';

export const RelatedProductsAlgorithmData = {
  id: '68ebce04-b96a-4c52-9329-08fc9d8c1253',
  appId: STORES_ALGORITHMS_APP_ID,
};

export const STORES_GALLERY_SEO = 'STORES_GALLERY_COMPONENT';

export const STORES_CATEGORY_SEO = 'STORES_CATEGORY';

export enum ReviewsSlotIds {
  ProductGalleryDetailsSlot1 = 'product-gallery-details-slot-1',
}

export const STORES_NAMESPACE = 'stores';

export enum WixCustomHeaders {
  Lang = 'lang',
  Currency = 'currency',
}

export enum GALLERY_TYPE {
  COLLECTION = 1,
  RELATED_PRODUCTS = 2,
  VELO_PRODUCTS = 3,
  ALGORITHMS = 4,
}

export enum ProductBorderStyleType {
  INLINE = 1,
  OUTLINE = 2,
}

export enum FilterTypeForFetch {
  CATEGORY = 'CATEGORY',
  FILTERED_CATEGORIES = 'FILTERED_CATEGORIES',
  OPTIONS = 'OPTIONS',
  MODIFIERS = 'MODIFIERS',
  PRICE = 'PRICE',
}

export enum FilterTypeFromFetch {
  CATEGORY = 'CATEGORY',
  FILTERED_CATEGORIES = 'FILTERED_CATEGORIES',
  PRICE = 'PRICE',
  COLOR = 'OPTION_COLOR',
  LIST = 'OPTION_LIST',
}

export enum AutoGridTemplateRepeatOptions {
  AUTO_FIT = 'auto-fit',
  AUTO_FILL = 'auto-fill',
}

export enum CategoryListStrategy {
  AUTOMATICALLY = 0,
  MANUALLY = 1,
}

export enum CategoryHeaderPosition {
  MinimizedAboveGallery = 0,
  StretchedTop = 1,
}

export enum CategoryHeaderLayout {
  TextBelow = 0,
  TextInside = 1,
  TextAbove = 2,
}

export enum GallerySlotIds {
  GalleryProductsTop = 'gallery-products-top',
  GalleryProductsBottom = 'gallery-products-bottom',
  CategoryPageListTop = 'category-page-list-top',
  GalleryFiltersTop = 'gallery-filters-top',
  GalleryFiltersBottom = 'gallery-filters-bottom',
  CategoryPageHeroTop = 'category-page-hero-top',
  CategoryPageHeroBottom = 'category-page-hero-bottom',
}

export enum SliderArrowsPlacement {
  Inside = 0,
  Outside = 1,
}
