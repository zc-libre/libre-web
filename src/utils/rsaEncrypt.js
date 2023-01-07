import { JSEncrypt } from 'jsencrypt'

// 加密
export function encrypt(publicKey, txt) {
  const encryptor = new JSEncrypt()
  encryptor.setPublicKey(publicKey) // 设置公钥
  return encryptor.encrypt(txt) // 对需要加密的数据进行加密
}
