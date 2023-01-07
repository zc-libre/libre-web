import request from '@/utils/request'

export function resetEmail(email) {
  return request({
    url: 'system/code/resetEmail',
    method: 'post',
    data: { email: email },
  })
}

export function updatePass(email) {
  return request({
    url: 'system/users/updatePass',
    method: 'post',
    data: { email: email },
  })
}
