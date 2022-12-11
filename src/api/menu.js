import request from '@/utils/request'

export function getTree() {
  return request({
    url: '/sys/menu/tree',
    method: 'get',
  })
}

export function doEdit(data) {
  return request({
    url: '/sys/menu',
    method: 'post',
    data,
  })
}

export function doDelete(data) {
  return request({
    headers: {
      'Content-Type': 'application/json;charset=UTF-8',
    },
    url: '/sys/menu',
    method: 'delete',
    data,
  })
}

export function getSupMenus(data) {
  return request({
    headers: {
      'Content-Type': 'application/json;charset=UTF-8',
    },
    url: '/sys/menu/superior',
    method: 'post',
    data,
  })
}

export function getMenusTree() {
  return request({
    url: 'sys/menu/all',
    method: 'get',
  })
}
