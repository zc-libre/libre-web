import request from '@/utils/request'

export function list(param) {
    return request({
        url: '/api/video/list',
        method: 'post',
        params: param,
    })
}

export function watch(id) {
    return request({
        url: 'api/video/watch/' + id,
        method: 'get',
    })
}

export default { list, watch }
