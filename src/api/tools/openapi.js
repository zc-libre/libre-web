import request from '@/utils/request'

export function getAnswer(question) {
  return request({
    url: 'api/openapi/chat?question=' + question,
    method: 'post',
  })
}
