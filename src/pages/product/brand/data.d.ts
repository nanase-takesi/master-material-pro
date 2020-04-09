export interface TableListItem {
  id: number;
  name: string;
  firstLetter: string;
  logo: string;
  bigPicture: number;
  sort: number;
  isFactory: Boolean;
  story: String;
  state: State;
  createTime: Date;
  updateTime: Date;
}

export enum State {
  'IN_USE' = 1,
  'INVALID' = 0,
}

export interface TableListPagination {
  total: number;
  pageSize: number;
  current: number;
}

export interface TableListData {
  list: TableListItem[];
  pagination: Partial<TableListPagination>;
}

export interface TableListParams {
  state?: State;
  name?: string;
  isFactory?: Boolean;
  pageSize?: number;
  currentPage?: number;
}
