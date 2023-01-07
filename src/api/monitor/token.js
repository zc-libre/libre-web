import request from '@/utils/request'

export function del(keys) {
  return request({
    url: 'auth/token',
    method: 'delete',
    data: keys,
  })
}
