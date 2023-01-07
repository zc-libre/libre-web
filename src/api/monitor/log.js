import request from '@/utils/request'

export function getErrDetail(id) {
  return request({
    url: 'api/sys/log/error/' + id,
    method: 'get',
  })
}

export function delAllError() {
  return request({
    url: 'api/sys/log/error',
    method: 'delete',
  })
}

export function delAllInfo() {
  return request({
    url: 'api/sys/log/info',
    method: 'delete',
  })
}
