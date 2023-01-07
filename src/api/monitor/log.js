import request from '@/utils/request'

export function getErrDetail(id) {
  return request({
    url: 'system/logs/error/' + id,
    method: 'get',
  })
}

export function delAllError() {
  return request({
    url: 'system/logs/error',
    method: 'delete',
  })
}

export function delAllInfo() {
  return request({
    url: 'system/logs/info',
    method: 'delete',
  })
}
