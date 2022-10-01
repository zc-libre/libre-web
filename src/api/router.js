import request from '@/utils/request'

export function getRouterList(data) {
  return request({
    url: '/auth/menus',
    method: 'get',
    data,
  })
}
