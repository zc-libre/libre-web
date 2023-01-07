import request from '@/utils/request'

export function del(keys) {
  return request({
    url: '/api/auth/token',
    method: 'delete',
    data: keys,
  })
}
