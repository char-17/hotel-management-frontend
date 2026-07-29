/* Spring Data Page response structure — used to extract content from paginated API responses */
export interface Page<T> {
  content: T[];
  totalElements: number;
  totalPages: number;
  number: number;
  size: number;
}
