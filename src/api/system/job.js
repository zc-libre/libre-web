import request from '@/utils/request'

export function add(data) {
  return request({
    url: 'system/jobs',
    method: 'post',
    data,
  })
}

export function pause(data) {
  return request({
    url: 'system/jobs/pause',
    method: 'put',
    data,
  })
}

export function resume(data) {
  return request({
    url: 'system/jobs/resume',
    method: 'put',
    data,
  })
}

export function edit(data) {
  return request({
    url: 'system/jobs/cron',
    method: 'put',
    data,
  })
}

export function del(data) {
  return request({
    url: 'system/jobs',
    method: 'delete',
    data: data,
  })
}

export default { add, pause, resume, edit, del }
