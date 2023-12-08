import request from '@/utils/request'

export function categoryList() {
    return request({
        url: '/api/blog/category/all',
        method: 'get',
    })
}


export function list(data) {
    return request({
        url: '/api/blog/category/list',
        method: 'post',
        data: data,
    })
}

export function add(data) {
    return request({
        url: '/api/blog/category/add',
        method: 'post',
        data: data,
    })
}

// 修改公告
export function edit(data) {
    return request({
        url: '/api/blog/category/update',
        method: 'post',
        data: data,
    })
}

// 删除公告
export function del(ids) {
    return request({
        url: '/api/blog/category/delete',
        method: 'post',
        data: ids,
    })
}

export default { add, del, edit }
