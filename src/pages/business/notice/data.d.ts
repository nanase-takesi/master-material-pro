export interface TableListItem {
  id: number;
  name: string;
  url: string;
  sort: number;
  state: State;
  remark: string;
  createTime: Date;
  updateTime: Date;
}

export enum State {
  'IN_USE' = 1,
  'INVALID' = 0 
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
  name?: string;
  state?: State;
  pageSize?: number;
  current?: number;
}
