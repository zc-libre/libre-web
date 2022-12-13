import request from '@/utils/request'
import { encryptedData } from '@/utils/encrypt'
import { loginRSA, tokenName } from '@/config'

export async function login(data) {
  if (loginRSA) {
    data = await encryptedData(data)
  }
  return request({
    url: '/auth/token',
    method: 'post',
    data,
  })
}

export function getUserInfo(accessToken) {
  return request({
    url: '/auth/userInfo',
    method: 'post',
    data: {
      [tokenName]: accessToken,
    },
  })
}

export function logout() {
  return request({
    url: '/auth/logout',
    method: 'post',
  })
}

export function register() {
  return request({
    url: '/auth/register',
    method: 'post',
  })
}
