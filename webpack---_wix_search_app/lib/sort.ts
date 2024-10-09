export enum SortOption {
  BestMatch = 'best_match',
  PriceAscending = 'price_ascending',
  PriceDescending = 'price_descending',
  Newest = 'newest',
  Closest = 'closest',
  Recent = 'recent',
  MostComments = 'most_comments',
  MostViewed = 'most_viewed',
  MostLiked = 'most_liked',
}

export const DEFAULT_SORT_OPTION = SortOption.BestMatch;
