import request from '@/utils/request'
import { getData } from '@/api/data'

export function get(name) {
  const params = {
    name,
    page: 0,
    size: 9999,
  }
  return request({
    url: 'api/sys/dict/info',
    method: 'get',
    params,
  })
}

export function getDictMap(names) {
  const params = {
    names: names,
    page: 0,
    size: 9999,
  }
  return getData('api/sys/dict/info/map', params)
}

export function add(data) {
  return request({
    url: 'api/sys/dict/info',
    method: 'post',
    data,
  })
}

export function del(id) {
  return request({
    url: 'api/sys/dict/info/' + id,
    method: 'delete',
  })
}

export function edit(data) {
  return request({
    url: 'api/sys/dict/info',
    method: 'put',
    data,
  })
}

export default { add, edit, del }
