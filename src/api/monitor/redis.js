import request from '@/utils/request'

// 查询 redis 详细
export function getRedisInfo() {
  return request({
    url: 'api/sys/monitor/redis',
    method: 'get',
  })
}
