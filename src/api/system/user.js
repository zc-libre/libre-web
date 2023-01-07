import request from '@/utils/request'
import { loadPublicKey } from '@/utils/auth'
import { encrypt } from '@/utils/rsaEncrypt'

export function add(data) {
  return request({
    url: '/api/sys/user/save',
    method: 'put',
    data,
  })
}

export function del(ids) {
  return request({
    url: '/api/sys/users',
    method: 'delete',
    data: ids,
  })
}

export function edit(data) {
  return request({
    url: '/api/sys/user/edit',
    method: 'post',
    data,
  })
}

export function editUser(data) {
  return request({
    url: '/api/sys/users/center',
    method: 'put',
    data,
  })
}

export function updatePass(user) {
  // TODO L.cm 用户的私钥
  const data = {
    oldPass: encrypt(loadPublicKey(), user.oldPass),
    newPass: encrypt(loadPublicKey(), user.newPass),
  }
  return request({
    url: '/api/sys/users/updatePass',
    method: 'post',
    data,
  })
}

export function updateEmail(form) {
  const data = {
    password: encrypt(loadPublicKey(), form.pass),
    email: form.email,
    code: form.code,
  }
  return request({
    url: '/api/sys/users/updateEmail',
    method: 'post',
    data,
  })
}

export default { add, edit, del }
