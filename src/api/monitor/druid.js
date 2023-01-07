import request from '@/utils/request'

/**
 * sql 监控信息
 */
export function getSqlList() {
  return request({
    url: 'api/sys/monitor/sql',
    method: 'get',
  })
}
