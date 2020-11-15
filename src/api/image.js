/**
 * 素材请求相关模块
 */
import request from '@/utils/request'

/**
 * 上传图片素材
 */
export const uploadImage = data => {
  return request({
    method: 'POST',
    url: '/mp/v1_0/user/images',
    // 一般文件上传的接口都要求把请求头中的 Content-Type 设置为multipart/form-data，
    // 我们使用axios上传文件不需要手动设置，你只要给data一个Formdata对象即可
    // new FormData
    data
  })
}
/**
 * 获取素材列表
 */
export const getImages = params => {
  return request({
    method: 'GET',
    url: '/mp/v1_0/user/images',
    params
  })
}
