import request from '@/utils/request'

export function getAuthMenus() {
  return request({
    url: '/api/auth/menus',
    method: 'get',
  })
}

export function getMenusTree() {
  return request({
    url: '/api/sys/menu/all',
    method: 'get',
  })
}

export function getMenus(params) {
  return request({
    url: '/api/sys/menu',
    method: 'get',
    params,
  })
}

export function getMenuSuperior(data) {
  return request({
    url: '/api/sys/menu/superior',
    method: 'post',
    data,
  })
}

export function add(data) {
  return request({
    url: '/api/sys/menu',
    method: 'post',
    data,
  })
}

export function del(ids) {
  return request({
    url: '/api/sys/menu',
    method: 'delete',
    data: ids,
  })
}

export function edit(data) {
  return request({
    url: '/api/sys/menu',
    method: 'put',
    data,
  })
}

export default { add, edit, del, getMenusTree, getMenuSuperior, getMenus }
