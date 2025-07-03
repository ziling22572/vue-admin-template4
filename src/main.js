import Vue from 'vue'
import 'normalize.css/normalize.css'
// todo 引入 Element
import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
import elementLocale from 'element-ui/lib/locale/lang/zh-CN'

import '@/styles/index.scss'

import App from './App'
import store from './store'
import router from './router'
import i18n from './lang' // ✅ 添加 i18n

import '@/icons'
import '@/permission'

if (process.env.NODE_ENV === 'production') {
  const { mockXHR } = require('../mock')
  mockXHR()
}

// 设置 ElementUI 语言
Vue.use(ElementUI, { locale: elementLocale })

Vue.config.productionTip = false

new Vue({
  el: '#app',
  router,
  store,
  i18n,  // ✅ 挂载 语言包
  render: h => h(App)
})
