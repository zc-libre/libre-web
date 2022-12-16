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
    url: '/sys/user/edit',
    method: 'post',
    data,
  })
}

export function save(data) {
  return request({
    url: '/sys/user/save',
    method: 'put',
    data,
  })
}
export function doDelete(data) {
  return request({
    headers: {
      'Content-Type': 'application/json;charset=UTF-8',
    },
    url: '/sys/user',
    method: 'delete',
    data,
  })
}

export function get(id) {
  return request({
    url: 'sys/roles/' + id,
    method: 'get',
  })
}
