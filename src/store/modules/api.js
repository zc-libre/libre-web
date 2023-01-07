const baseUrl = process.env.VUE_APP_BASE_API
const api = {
  state: {
    // 实时控制台
    socketApi: baseUrl + '/websocket?token=kl',
    // 图片上传
    imagesUploadApi: baseUrl + '/system/pictures',
    // 修改头像
    updateAvatarApi: baseUrl + '/system/users/avatar',
    // swagger
    swaggerApi: baseUrl + '/doc.html',
    // 文件上传
    fileUploadApi: baseUrl + '/system/localStorage',
    // baseUrl，
    baseApi: baseUrl,
  },
}

export default api
