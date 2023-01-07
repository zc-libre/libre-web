import request from '@/utils/request'

export function add(data) {
  return request({
    url: 'api/sys/job',
    method: 'post',
    data,
  })
}

export function pause(data) {
  return request({
    url: 'api/sys/job/pause',
    method: 'put',
    data,
  })
}

export function resume(data) {
  return request({
    url: 'api/sys/job/resume',
    method: 'put',
    data,
  })
}

export function updateStatus(id) {
  return request({
    url: 'api/sys/job/update/' + id,
    method: 'put',
  })
}

export function edit(data) {
  return request({
    url: 'api/sys/job/cron',
    method: 'put',
    data,
  })
}

export function del(id) {
  return request({
    url: 'api/sys/job/' + id,
    method: 'delete',
  })
}

export default { add, pause, resume, edit, del, updateStatus }
