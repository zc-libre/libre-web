import request from '@/utils/request'

export function get() {
  return request({
    url: 'api/qiNiuContent/config',
    method: 'get',
  })
}

export function update(data) {
  return request({
    url: 'api/qiNiuContent/config',
    data,
    method: 'put',
  })
}

export function download(id) {
  return request({
    url: 'api/sys/files/path/' + id,
    method: 'get',
  })
}

export function sync() {
  return request({
    url: '/api/sys/files/sync',
    method: 'post',
  })
}

export function del(ids) {
  return request({
    url: '/api/sys/files',
    method: 'delete',
    data: ids,
  })
}

export default { del, download, sync }
