import Vue from 'vue'
import VueRouter from 'vue-router'
// 在VueCLI创建的项目中 @ 表示 src 目录
// 它是src目录的路径别名
// 好处：它不受当前路径的影响
// 注意：@ 就是src路径，后面的斜杠别忘了
// 建议：如果加载的路径就在当前目录下，那就正常写
//      如果需要进行父级路径查找都使用@
import Login from '@/views/login'
import Home from '@/views/home'
import Layout from '@/views/layout'
import Article from '@/views/article'
import Publish from '@/views/publish'
import Image from '@/views/image'
import Comment from '@/views/comment'
import Settings from '@/views/settings'

Vue.use(VueRouter)

const routes = [
  {
    path: '/login',
    name: 'login',
    component: Login
  },
  {
    path: '/',
    // 命名路由 layout 有一个默认子路由，这个名字没有意义
    // 正确的做法是，如果有默认子路由，就不要给父路由起名字了
    // name: 'layout',
    component: Layout,
    children: [
      {
        path: '', // path为空，会作为默认子路由渲染
        name: 'home',
        component: Home
      },
      {
        path: '/article',
        name: 'article',
        component: Article
      },
      {
        path: '/publish',
        name: 'publish',
        component: Publish
      },
      {
        path: '/image',
        name: 'image',
        component: Image
      },
      {
        path: '/comment',
        name: 'comment',
        component: Comment
      },
      {
        path: '/settings',
        name: 'settings',
        component: Settings
      }
    ]
  }
]

const router = new VueRouter({
  routes
})

// 路由导航守卫，说白了所有页面的导航都会经过这里
// 守卫页面导航的
// to：要去的路由信息
// from:来自哪里的路由信息
// next：放行方法
router.beforeEach((to, from, next) => {
  // 如果要访问的页面不是 /login，校验登陆状态
  // 如果没有登录，则跳转到登陆页面
  // 如果登陆了，则允许通过
  // 是 /login 允许通过
  const user = JSON.parse(window.localStorage.getItem('user'))

  // 校验非登录页面的登陆状态
  if (to.path !== '/login') {
    if (user) {
      next()
    } else {
      // 没有登陆，跳转到登陆页面
      next('/login')
    }
  } else {
    // 登陆页面。允许通过
    next()
  }
})
export default router
