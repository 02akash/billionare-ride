export function getTotalPages(pageSize: number, totalResults: number): number {
  return Math.ceil(totalResults / pageSize);
}
