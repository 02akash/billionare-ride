import {
  SearchDocumentType,
  SearchOrderingDirection,
  ISearchRequestOrdering,
  ISearchRequest,
} from '@wix/client-search-sdk';

import { SortOption, DEFAULT_SORT_OPTION } from '../../../../../lib/sort';

enum ForumOrderingField {
  CreatedDate = 'createdDate',
  LastActivityDate = 'lastActivityDate',
  LikeCount = 'likeCount',
  TotalComments = 'totalComments',
  ViewCount = 'viewCount',
}

enum EventsOrderingField {
  StartDate = 'startDate',
}

enum BlogOrderingField {
  PublishDate = 'publishDate',
}

enum ProductsOrderingField {
  DiscountedPriceNumeric = 'discountedPriceNumeric',
}

const orderingByDocumentTypeAndSortOption: Partial<
  Record<
    SearchDocumentType,
    Partial<Record<SortOption, ISearchRequestOrdering['ordering']>>
  >
> = {
  [SearchDocumentType.Forums]: {
    [SortOption.Recent]: [
      {
        fieldName: ForumOrderingField.LastActivityDate,
        direction: SearchOrderingDirection.Descending,
      },
    ],
    [SortOption.Newest]: [
      {
        fieldName: ForumOrderingField.CreatedDate,
        direction: SearchOrderingDirection.Descending,
      },
    ],
    [SortOption.MostComments]: [
      {
        fieldName: ForumOrderingField.TotalComments,
        direction: SearchOrderingDirection.Descending,
      },
    ],
    [SortOption.MostViewed]: [
      {
        fieldName: ForumOrderingField.ViewCount,
        direction: SearchOrderingDirection.Descending,
      },
    ],
    [SortOption.MostLiked]: [
      {
        fieldName: ForumOrderingField.LikeCount,
        direction: SearchOrderingDirection.Descending,
      },
    ],
  },
  [SearchDocumentType.Events]: {
    [SortOption.Closest]: [
      {
        fieldName: EventsOrderingField.StartDate,
        direction: SearchOrderingDirection.Ascending,
      },
    ],
  },
  [SearchDocumentType.Blogs]: {
    [SortOption.Newest]: [
      {
        fieldName: BlogOrderingField.PublishDate,
        direction: SearchOrderingDirection.Descending,
      },
    ],
  },
  [SearchDocumentType.Products]: {
    [SortOption.PriceAscending]: [
      {
        fieldName: ProductsOrderingField.DiscountedPriceNumeric,
        direction: SearchOrderingDirection.Ascending,
      },
    ],
    [SortOption.PriceDescending]: [
      {
        fieldName: ProductsOrderingField.DiscountedPriceNumeric,
        direction: SearchOrderingDirection.Descending,
      },
    ],
  },
};

const sortOptionByOrderingFieldAndDirection: Record<
  string,
  Partial<Record<SearchOrderingDirection, SortOption | undefined>> | undefined
> = {
  [ForumOrderingField.CreatedDate]: {
    [SearchOrderingDirection.Descending]: SortOption.Newest,
  },
  [ForumOrderingField.LastActivityDate]: {
    [SearchOrderingDirection.Descending]: SortOption.Recent,
  },
  [ForumOrderingField.LikeCount]: {
    [SearchOrderingDirection.Descending]: SortOption.MostLiked,
  },
  [ForumOrderingField.TotalComments]: {
    [SearchOrderingDirection.Descending]: SortOption.MostComments,
  },
  [ForumOrderingField.ViewCount]: {
    [SearchOrderingDirection.Descending]: SortOption.MostViewed,
  },
  [EventsOrderingField.StartDate]: {
    [SearchOrderingDirection.Ascending]: SortOption.Closest,
  },
  [BlogOrderingField.PublishDate]: {
    [SearchOrderingDirection.Descending]: SortOption.Newest,
  },
  [ProductsOrderingField.DiscountedPriceNumeric]: {
    [SearchOrderingDirection.Ascending]: SortOption.PriceAscending,
    [SearchOrderingDirection.Descending]: SortOption.PriceDescending,
  },
};

export function getOrdering(
  documentType: SearchDocumentType | undefined,
  sortOption: SortOption,
): ISearchRequestOrdering {
  const ordering = documentType
    ? orderingByDocumentTypeAndSortOption[documentType]?.[sortOption]
    : undefined;

  return {
    ordering: ordering ?? [],
  };
}

export const convertSearchRequestToSortOption = ({
  ordering,
}: Pick<ISearchRequest, 'ordering'>): SortOption => {
  const orderingItem = ordering?.ordering?.[0];

  if (orderingItem) {
    const { fieldName, direction } = orderingItem;
    const sortOption =
      sortOptionByOrderingFieldAndDirection[fieldName]?.[direction];

    if (sortOption) {
      return sortOption;
    }
  }

  return DEFAULT_SORT_OPTION;
};
