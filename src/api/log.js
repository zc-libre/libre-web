import request from '@/utils/request'

export function getInfo(data) {
  return request({
    url: '/sys/log/info',
    method: 'post',
    data,
  })
}

export function getError(data) {
  return request({
    url: '/sys/log/error',
    method: 'post',
    data,
  })
}

export function getList() {
  return request({
    url: '/sys/log/list',
    method: 'get',
  })
}

export function getErrorDetail(id) {
  return request({
    url: '/sys/log/error/' + id,
    method: 'get',
  })
}
