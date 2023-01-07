import Settings from '@/settings'
import Storage from './storage'

const TokenKey = Settings.TokenKey
const PublicKey = Settings.PublicKey

export function getToken() {
  return Storage.get(TokenKey)
}

export function setToken(token) {
  return Storage.set(TokenKey, token)
}

export function removeToken() {
  return Storage.remove(TokenKey)
}

export function loadPublicKey() {
  return Storage.get(PublicKey)
}

export function savePublicKey(publicKey) {
  return Storage.set(PublicKey, publicKey)
}
