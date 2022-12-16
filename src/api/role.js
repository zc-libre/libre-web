import request from '@/utils/request'

export function getPage(data) {
  return request({
    url: '/sys/role/page',
    method: 'post',
    data,
  })
}

export function getList() {
  return request({
    url: '/sys/role/list',
    method: 'get',
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
    headers: {
      'Content-Type': 'application/json;charset=UTF-8',
    },
    url: 'sys/role/edit_menu',
    method: 'post',
    data,
  })
}
export function doDelete(data) {
  return request({
    headers: {
      'Content-Type': 'application/json;charset=UTF-8',
    },
    url: '/sys/role',
    method: 'delete',
    data,
  })
}
