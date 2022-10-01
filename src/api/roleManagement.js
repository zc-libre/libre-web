import request from '@/utils/request'

export function getList(data) {
  return request({
    url: '/sys/role/list',
    method: 'post',
    data,
  })
}

export function get(id) {
  return request({
    url: 'sys/role/' + id,
    method: 'get',
  })
}

export function doEdit(data) {
  return request({
    url: '/sys/role/edit',
    method: 'post',
    data,
  })
}

export function getMenu(id) {
  return request({
    url: `sys/role/${id}/menus`,
    method: 'get',
  })
}

export function editMenu(data) {
  return request({
    url: 'sys/role/edit_menu',
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
