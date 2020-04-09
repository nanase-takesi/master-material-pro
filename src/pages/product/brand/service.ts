import request from '@/utils/request';
import { TableListParams } from './data.d';

export async function queryBrand(params?: TableListParams) {
  return request('/api/mdc/brand/list', {
    params,
  });
}

export async function removeBrand(id: number) {
  return request(`/api/mdc/brand/${id}/delete`, {
    method: 'DELETE',
  });
}

