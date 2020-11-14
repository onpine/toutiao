/**
 * 文章相关请求模块
 */
import request from '@/utils/request'

/**
 * 获取文章列表
 */
export const getArticles = params => {
  return request({
    method: 'GET',
    url: '/mp/v1_0/articles',
    // Body参数使用data 设置
    // Query 参数使用 params 设置
    // headers 参数使用 Headers 设置
    params
  })
}
/**
 * 获取文章频道
 */
export const getArticleChannels = () => {
  return request({
    method: 'GET',
    url: '/mp/v1_0/channels'
  })
}
/**
 * 删除文章
 */
export const deleteArticle = articleId => {
  return request({
    method: 'DELETE',
    // 接口文档中的写的路径参数需要在url中传递
    // 看到接口文档中有 :xxx 格式的字段，则需要传递路径参数
    url: `/mp/v1_0/articles/${articleId}`
  })
}
/**
 * 新建文章
 */
export const addArticle = (data, draft = false) => {
  return request({
    method: 'POST',
    url: '/mp/v1_0/articles',
    params: {
      // 是否存为草稿（true为草稿）
      draft
    },
    data
  })
}
/**
 * 修改文章
 */
export const updataArticle = (articleId, data, draft = false) => {
  return request({
    method: 'PUT',
    url: `/mp/v1_0/articles/${articleId}`,
    params: {
      draft
    },
    data
  })
}
/**
 * 获取文章
 */
export const getArticle = articleId => {
  return request({
    method: 'GET',
    url: `/mp/v1_0/articles/${articleId}`
  })
}
