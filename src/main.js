import Vue from 'vue'

import 'normalize.css/normalize.css' // A modern alternative to CSS resets

import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'

import '@/styles/index.scss' // global css

import App from './App'
import store from './store'
import router from './router'

import '@/icons' // icon
import '@/router/routers' // permission control

// 将字符串时间配置引入架构中 之后所有的时间都可以直接使用期方法
import '@/utils/timeUtil.js'

// 权限
import permission from './components/Permission'
Vue.use(permission)

// 限制输入框输入必为int
import drectives from './utils/drectives'
Vue.use(drectives)

// 数据字典
import dict from './components/Dict'
Vue.use(dict)

import JsonViewer from 'vue-json-viewer/ssr'

Vue.use(JsonViewer)
import 'vue-json-viewer/style.css'

/**
 * 注意：
 * 目前在开发环境下默认使用mock数据，
 * 如果开发过程中需要代理到真正的后端服务接口，
 * 可以注释掉此处代码，然后在proxy中配置真实接口代理
 */
if (process.env.NODE_ENV === 'development') {
  const { mockXHR } = require('../mock')
  mockXHR()
}

// set ElementUI lang to EN
// Vue.use(ElementUI, { locale })
// 如果想要中文版 element-ui，按如下方式声明
Vue.use(ElementUI, { size: 'small' })

Vue.config.productionTip = false

new Vue({
  el: '#app',
  router,
  store,
  render: h => h(App)
})
