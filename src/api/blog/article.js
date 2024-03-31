import request from '@/utils/request'

export function listAll() {
    return request({
        url: '/api/blog/article/all',
        method: 'get',
    })
}

export function list(data) {
    return request({
        url: '/api/blog/article/list',
        method: 'post',
        data: data,
    })
}


export function add(data) {
    return request({
        url: '/api/blog/article/add',
        method: 'post',
        data: data,
    })
}

export function get(id) {
    return request({
        url: `/api/blog/article/${id}`,
        method: 'get',
    })
}

// 修改公告
export function edit(data) {
    return request({
        url: '/api/blog/article/update',
        method: 'post',
        data: data,
    })
}
// 删除公告
export function del(ids) {
    return request({
        url: '/api/blog/article',
        method: 'delete',
        data: ids,
    })
}

export function changeStatus(data) {
  return request({
    url: '/api/blog/article/changeStatus',
    method: 'post',
    data: data,
  })
}

export function changeTop(data) {
  return request({
    url: '/api/blog/article/changeTop',
    method: 'post',
    data: data,
  })
}

export default { add, edit, del, get }
