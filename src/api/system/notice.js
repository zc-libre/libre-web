import request from '@/utils/request'

// 查询公告列表
export function listNotice(query) {
  return request({
    url: '/system/notice/list',
    method: 'get',
    params: query,
  })
}

// 查询公告详细
export function getNotice(noticeId) {
  return request({
    url: '/system/notice/' + noticeId,
    method: 'get',
  })
}

// 新增公告
export function add(data) {
  return request({
    url: '/system/notice',
    method: 'post',
    data: data,
  })
}

// 修改公告
export function edit(data) {
  return request({
    url: '/system/notice',
    method: 'put',
    data: data,
  })
}

// 删除公告
export function del(ids) {
  return request({
    url: '/system/notice',
    method: 'delete',
    data: ids,
  })
}

export default { add, edit, del }
