export interface ListReq {
  page: number;
  size: number;
  keyword?: string;
}

export interface ListRes<T> {
  total: number;
  items: T[];
}
