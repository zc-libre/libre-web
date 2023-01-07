import request from '@/utils/request'

/**
 * 服务器信息
 */
export function getServerInfo() {
  return request({
    url: '/api/sys/monitor/server',
    method: 'get',
  })
}
