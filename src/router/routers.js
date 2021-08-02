import router from './index'
import store from '../store'
import { Message } from 'element-ui'
import NProgress from 'nprogress' // progress bar
import 'nprogress/nprogress.css' // progress bar style
import { getToken } from '@/utils/auth' // get token from cookie
import getPageTitle from '@/utils/get-page-title'
import { fetchResource } from '@/api/common'

/* Layout */
import Layout from '@/layout'

NProgress.configure({ showSpinner: false }) // NProgress Configuration

const whiteList = ['/login'] // no redirect whitelist

router.beforeEach(async(to, from, next) => {
  NProgress.start()

  document.title = getPageTitle(to.meta.title)

  console.log('to: ' + to.fullPath)

  if (whiteList.indexOf(to.path) !== -1) {
    next()
  } else {
    const hasToken = getToken()
    if (hasToken) {
      if (to.path === '/login') {
        next({ path: '/' })
      } else {
        const hasName = store.getters.name
        if (hasName) {
          next()
        } else {
          try {
            await store.dispatch('user/getInfo')
            loadMenus(next, to)
          } catch (error) {
            Message.error(error || 'Has Error')
            next(`/login?redirect=${to.path}`)
          }
        }
      }
    } else {
      next(`/login?redirect=${to.path}`)
    }
  }
})

router.afterEach(() => {
  NProgress.done()
})

const loadMenus = (next, to) => {
  fetchResource().then(res => {
    const asyncRouter = filterAsyncRouter('', res.data)
    asyncRouter.push({ path: '*', redirect: '/404', hidden: true })
    // 存储路由
    store.dispatch('permission/GenerateRoutes', asyncRouter).then(() => {
      // 动态添加可访问路由表
      router.addRoutes(asyncRouter)
      next({ ...to, replace: true })
    })
  }).catch(err => {
    console.log('获取菜单、权限异常' + err)
  })
}

// 遍历后台传来的路由字符串，转换为组件对象
const filterAsyncRouter = (parentPath, routers) => {
  return routers.filter(router => {
    if (router.component) {
      // Layout组件特殊处理
      if (router.component === 'Layout') {
        router.component = Layout
      } else {
        const component = router.component
        router.component = loadView(component)
      }
    }
    if (router.children && router.children.length) {
      router.children = filterAsyncRouter(router.path, router.children)
    } else {
      delete router.children
    }
    return true
  })
}

const loadView = (view) => {
  return (resolve) => require([`@/views/${view}`], resolve)
}
