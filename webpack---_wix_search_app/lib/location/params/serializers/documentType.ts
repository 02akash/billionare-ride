import { SearchDocumentType } from '@wix/client-search-sdk';
import { DEFAULT_SEARCH_REQUEST } from '../defaultSearchRequest';

export const documentTypeEncodingMap: Record<SearchDocumentType, string> = {
  [SearchDocumentType.All]: 'all',
  [SearchDocumentType.Pages]: 'pages',
  [SearchDocumentType.Products]: 'products',
  [SearchDocumentType.Blogs]: 'blogs',
  [SearchDocumentType.Forums]: 'forums',
  [SearchDocumentType.Bookings]: 'services',
  [SearchDocumentType.Events]: 'events',
  [SearchDocumentType.Programs]: 'programs',
  [SearchDocumentType.ProGallery]: 'gallery',
};

export const documentTypeDecodingMap: Record<string, SearchDocumentType> = {
  all: SearchDocumentType.All,
  pages: SearchDocumentType.Pages,
  products: SearchDocumentType.Products,
  blogs: SearchDocumentType.Blogs,
  forums: SearchDocumentType.Forums,
  bookings: SearchDocumentType.Bookings, // Old bookings param (only used with path params)
  services: SearchDocumentType.Bookings,
  events: SearchDocumentType.Events,
  programs: SearchDocumentType.Programs,
  gallery: SearchDocumentType.ProGallery,
};

export function encodeDocumentType(
  documentType?: SearchDocumentType,
): string | undefined {
  if (!documentType || documentType === DEFAULT_SEARCH_REQUEST.documentType) {
    return;
  }
  return documentTypeEncodingMap[documentType];
}

export function decodeDocumentType(
  encodedDocumentType?: string,
): SearchDocumentType | undefined {
  return encodedDocumentType
    ? documentTypeDecodingMap[encodedDocumentType]
    : undefined;
}
