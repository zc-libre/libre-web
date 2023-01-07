import request from '@/utils/request'

// 获取所有的Role
export function getAll() {
  return request({
    url: '/api/sys/role/all',
    method: 'get',
  })
}

export function add(data) {
  return request({
    url: '/api/sys/role/edit',
    method: 'post',
    data,
  })
}

export function get(id) {
  return request({
    url: '/api/sys/role/get/' + id,
    method: 'get',
  })
}

export function del(ids) {
  return request({
    url: '/api/sys/role',
    method: 'delete',
    data: ids,
  })
}

export function edit(data) {
  return request({
    url: '/api/sys/role/edit',
    method: 'post',
    data,
  })
}

export function getMenu(id) {
  return request({
    url: `/api/sys/role/${id}/menus`,
    method: 'get',
  })
}

export function editMenu(data) {
  return request({
    url: '/api/sys/role/menu',
    method: 'put',
    data,
  })
}

export default { add, edit, del, get, getMenu, editMenu }
