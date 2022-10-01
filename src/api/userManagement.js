import request from '@/utils/request'

export function getList(data) {
  return request({
    url: '/sys/user/list',
    method: 'post',
    data,
  })
}

export function doEdit(data) {
  return request({
    url: '/sys/role/edit',
    method: 'post',
    data,
  })
}

export function doDelete(data) {
  return request({
    url: '/sys/role/delete',
    method: 'post',
    data,
  })
}

export function get(id) {
  return request({
    url: 'sys/roles/' + id,
    method: 'get',
  })
}
