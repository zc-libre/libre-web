import request from '@/utils/request'
import qs from 'qs'

/**
 * get 数据
 * @param url 地址
 * @param params 参数
 * @returns 数据
 */
export function getData(url, params) {
  return request({
    url: url + '?' + qs.stringify(params, { indices: false }),
    method: 'get',
  })
}

/**
 * 资源下载
 * @param url 地址
 * @param params 参数
 * @returns 数据
 */
export function download(url, params) {
  return request({
    url: url + '?' + qs.stringify(params, { indices: false }),
    method: 'get',
    responseType: 'blob',
  })
}
