import request from '@/utils/request';
import { TableListParams, TableListItem } from './data.d';

export async function querySystemNotice(params?: TableListParams) {
  return request('/api/mac/system/notice/list', {
    params,
  });
}

export async function deleteSystemNotice(id: number) {
  return request(`/api/mac/system/notice/${id}/delete`, {
    method: 'DELETE',
  });
}

export async function unDeleteSystemNotice(id: number) {
  return request(`/api/mac/system/notice/${id}/un_delete`, {
    method: 'PATCH',
  });
}

export async function addSystemNotice(params: TableListItem) {
  return request('/api/mac/system/notice/add', {
    method: 'POST',
    data: {
      ...params,
    },
  });
}

export async function updateSystemNotice(id?: number, params?: TableListItem) {
  return request(`/api/mac/system/notice/${id}/update`, {
    method: 'PUT',
    data: {
      ...params,
    },
  });
}
