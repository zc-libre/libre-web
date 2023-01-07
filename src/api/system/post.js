import request from '@/utils/request'

export function getAllPost() {
  const params = {
    page: 0,
    size: 9999,
    enabled: 1,
  }
  return request({
    url: 'system/post',
    method: 'get',
    params,
  })
}

export function add(data) {
  return request({
    url: 'system/post',
    method: 'post',
    data,
  })
}

export function del(ids) {
  return request({
    url: 'system/post',
    method: 'delete',
    data: ids,
  })
}

export function edit(data) {
  return request({
    url: 'system/post',
    method: 'put',
    data,
  })
}

export default { add, edit, del }
