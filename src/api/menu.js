import request from '@/utils/request'

export function getTree(data) {
  return request({
    url: '/sys/menu/getTree',
    method: 'post',
    data,
  })
}

export function doEdit(data) {
  return request({
    url: '/menuManagement/doEdit',
    method: 'post',
    data,
  })
}

export function doDelete(data) {
  return request({
    url: '/sys/menu/delete',
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
