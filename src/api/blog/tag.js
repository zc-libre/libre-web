import request from '@/utils/request'

export function listAllTag() {
    return request({
        url: '/api/blog/tag/all',
        method: 'get',
    })
}

export function list(data) {
    return request({
        url: '/api/blog/tag/list',
        method: 'post',
        data: data,
    })
}


export function add(data) {
    return request({
        url: '/api/blog/tag/save',
        method: 'post',
        data: data,
    })
}

// 修改公告
export function edit(data) {
    return request({
        url: '/api/blog/tag/update',
        method: 'post',
        data: data,
    })
}

// 删除公告
export function del(ids) {
    return request({
        url: '/api/blog/tag/delete',
        method: 'post',
        data: ids,
    })
}

export default { add, edit, del }
