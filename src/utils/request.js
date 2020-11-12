/**
 * 基于axios封装的请求模块
 */
import axios from 'axios'
import JSONbig from 'json-bigint'

// 创建一个axios实例，说白了就是复制了一个axios
// 我们通过这个实例去发送请求，把需要的配置给这个实例来处理
const request = axios.create({
  baseURL: 'http://ttapi.research.itcast.cn/', // 请求的基础路径

  // 定义后端返回的原始数据的处理
  // 参数data就是后端返回的原始数据（未经处理的 JSON格式字符串）
  transformResponse: [function (data) {
    // 后端返回的数据可能不是JSON格式字符串
    // 如果不是的话，那么JSONbig.parse调用就会报错
    // 所以我们使用try-catch来捕获异常，处理异常的发生
    try {
      // 如果转换成功，直接返回
      return JSONbig.parse(data)
    } catch (err) {
      // 如果转换失败了，则进入这里，把data原始数据返回
      return data
    }

    // axios默认使用JSON.parse 来转换处理原始数据
    // return JSON.parse(data)
  }]
})

// 请求拦截器
request.interceptors.request.use(
  // 任何所有请求都会经过这里
  // config 时当前请求相关的配置信息对象
  // config 是可以修改的
  function (config) {
    const user = JSON.parse(window.localStorage.getItem('user'))

    // 如果又有用户登录信息，则统一设置token
    if (user) {
      config.headers.Authorization = `Bearer ${user.token}`
    }

    // 当这里 return config 之后请求才会真正的发出去
    return config
  },
  // 请求失败会经过这里
  function (error) {
    return Promise.reject(error)
  }
)

// 响应拦截器

// 导出请求方法
export default request
