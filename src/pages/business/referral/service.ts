import request from '@/utils/request';
import { TableListParams, TableListItem } from './data.d';

export async function queryReferralList(params?: TableListParams) {
  return request('/api/mac/referral/list', {
    params,
  });
}

export async function batchDeleteReferral(ids: { id: number[] }) {
  return request('/api/mac/referral/batch_delete', {
    method: 'DELETE',
    data: {
      ...ids,
    },
  });
}

export async function deleteReferral(id: number) {
  return request(`/api/mac/referral/${id}/delete`, {
    method: 'DELETE',
  });
}

export async function cancelDeleteReferral(id: number) {
  return request(`/api/mac/referral/${id}/un_delete`, {
    method: 'PATCH',
  });
}

export async function addReferral(params: TableListItem) {
  return request('/api/mac/referral/add', {
    method: 'POST',
    data: {
      ...params,
    },
  });
}

export async function updateReferral(id?: number, params?: TableListItem) {
  return request(`/api/mac/referral/${id}/update`, {
    method: 'PUT',
    data: {
      ...params,
    },
  });
}
