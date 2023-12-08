import request from '@/utils/request'

export function upload(file) {
    return request({
        url: '/api/sys/files',
        method: 'post',
        data: file,
        headers: {'Content-Type': 'multipart/form-data'},
    })
}


export default { upload }
