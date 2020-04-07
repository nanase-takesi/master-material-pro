import request from '@/utils/request';
import { TableListParams, TableListItem } from './data.d';

export async function queryRotationList(params?: TableListParams) {
  return request('/api/mac/rotation/list', {
    params,
  });
}

export async function addRotation(params: TableListItem) {
  return request('/api/mac/rotation/add', {
    method: 'POST',
    data: {
      ...params,
    },
  });
}

export async function updateRotation(id?: number, data?: TableListItem) {
  return request(`/api/mac/rotation/${id}/update`, {
    method: 'PUT',
    data,
  })
}

export async function deleteRotation(id: number) {
  return request(`/api/mac/rotation/${id}/delete`, {
    method: 'DELETE',
  })
}

export async function bratchDeleteRotation(params: { ids: number[] }) {
  return request('/api/mac/rotation/batch_delete', {
    method: 'DELETE',
    data: {
      ...params,
    },
  });
}


