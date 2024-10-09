import { DEFAULT_SEARCH_REQUEST } from '../defaultSearchRequest';

export function encodePage(page?: number): string | undefined {
  if (!page || page === DEFAULT_SEARCH_REQUEST.page) {
    return;
  }

  return page.toString();
}

export function decodePage(encodedPage?: string): number | undefined {
  if (!encodedPage) {
    return;
  }

  const page = parseInt(encodedPage, 10);
  return page > 0 ? page : undefined;
}
