export interface ListReq {
  page: number;
  size: number;
}

export interface ListRes<T> {
  total: number;
  items: T[];
}
