export interface TableListItem {
  id: number;
  name: string;
  imageUrl: string;
  url: string;
  sort: number;
  state: State;
  status: number;
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
  state?: State;
  name?: string;
  pageSize?: number;
  current?: number;
}
