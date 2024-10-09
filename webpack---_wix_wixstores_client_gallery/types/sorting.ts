import {SortingOptionBooleanKey, SortingOptionField, SortingOptionId, SortingOptionTitleKey} from './galleryTypes';

export interface ISortingOption {
  field: SortingOptionField;
  direction?: SortingDirection;
  id: SortingOptionId;
  titleKey: SortingOptionTitleKey;
  settingsShouldDisplayKey?: SortingOptionBooleanKey;
}

export interface ISorting extends ISortingParam {
  id: string;
  titleKey: string;
}

export enum SortingDirection {
  Ascending = 'ASC',
  Descending = 'DESC',
}

export interface ISortingParam {
  field: string;
  direction?: SortingDirection;
}

export interface IExternalSorting {
  direction: SortingDirection;
  fieldName: string;
}

export enum SortExternalFields {
  DiscountedPrice = 'discountedPriceNumeric',
  Name = 'title',
  CreationDate = 'creationDate',
}

export type Sorting = ISorting | IExternalSorting;
