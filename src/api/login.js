import qs from 'qs'
import request from '@/utils/request'

// 获取密码加密公钥
export function getPublicKey() {
  return request({
    url: '/auth/public-key',
    method: 'get',
  })
}
// 获取登录的用户信息
export function getInfo() {
  return request({
    url: '/api/auth/info',
    method: 'get',
  })
}
// 获取验证码
export function getCodeImg() {
  return request({
    url: 'api/auth/captcha?t=' + new Date().getTime(),
    method: 'get',
  })
}
// 登录
export function login(data) {
  return request({
    url: '/api/auth/token',
    method: 'post',
    data: qs.stringify(data),
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
    },
  })
}
// 登出
export function logout() {
  return request({
    url: '/api/auth/logout',
    method: 'delete',
  })
}
