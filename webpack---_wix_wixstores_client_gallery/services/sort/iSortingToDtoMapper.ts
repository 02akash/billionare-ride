import {ProductSortField, SortDirection} from '@wix/wixstores-graphql-schema';
import {ProductSort} from '../../graphql/queries-schema';
import {IExternalSorting, ISorting, SortExternalFields} from '../../types/sorting';

export const mapISortingToIProductSortDto = (sortingOption: ISorting | null): ProductSort | null => {
  return sortingOption?.field
    ? {
        direction: sortingOption.direction === 'ASC' ? SortDirection.Ascending : SortDirection.Descending,
        sortField: sortingOption.field as ProductSortField,
      }
    : null;
};

export const mapISortingToSiteSearchSortDto = (sortingOption: ISorting | null): IExternalSorting | null => {
  const fieldName = getExternalFieldName(sortingOption?.field);
  return fieldName
    ? {
        direction: sortingOption.direction,
        fieldName,
      }
    : null;
};

const getExternalFieldName = (field: string): string => {
  switch (field) {
    case 'comparePrice':
      return SortExternalFields.DiscountedPrice;
    case 'name':
      return SortExternalFields.Name;
    case 'creationDate':
      return SortExternalFields.CreationDate;
    default:
      return null;
  }
};
