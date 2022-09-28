import Vue from 'vue'

import Cookies from 'js-cookie'

import 'normalize.css/normalize.css' // CSS重置的现代替代方案

import Element from 'element-ui'
import './styles/element-variables.scss'

import '@/styles/index.scss' 

import App from './App'
import store from './store'
import router from './router'

import './icons' // icon
import './permission' // 权限控制




import * as filters from './filters' // global filters
//导入封装信息确认提示框组件脚本
import myconfirm from '@/utils/myconfirm'
Vue.prototype.$myconfirm = myconfirm;
//导入清空表单数据脚本
import restForm from '@/utils/restForm'
Vue.prototype.$restForm = restForm;
//导入表单数据回显脚本
import objCopy from '@/utils/objCopy'
Vue.prototype.$objCopy = objCopy;
//导入按钮权限判断
import hasPermission from '@/permission/index'
Vue.prototype.hasPermission = hasPermission;
Vue.use(Element, {
  size: Cookies.get('size') || 'medium', 

})

// register global utility filters
Object.keys(filters).forEach(key => {
  Vue.filter(key, filters[key])
})
Vue.config.silent = true
Vue.config.productionTip = false

new Vue({
  el: '#app',
  router,
  store,
  render: h => h(App)
})
