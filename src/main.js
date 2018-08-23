// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import router from './router'
import axios from 'axios' // 引入http管理
import { Flexbox, FlexboxItem, Group, Previewer, Loading } from 'vux'
import MintUI from 'mint-ui'
import 'mint-ui/lib/style.css'
// 引入moment插件用于时间格式化
import moment from 'moment'
import App from './App'
// 引入MUI样式
// import '../lib/mui/css/mui.min.css'

import '../lib/mui/css/icons-extra.css'
// 引入animate.css
// import 'animate.css'

Vue.config.productionTip = false
Vue.component('flexbox', Flexbox)
Vue.component('flexbox-item', FlexboxItem)
Vue.component('group', Group)
Vue.component('previewer', Previewer)
Vue.component('loading', Loading)
Vue.use(MintUI)
// Vue.use(animated)
// 全局配置axios
Vue.prototype.$http = axios
Vue.prototype.url = 'https://www.beefindtech.com:8443'
// 定义一个全局过滤器
Vue.filter('dataformat', function (dataStr, pattern = 'YYYY-MM-DD HH:mm:ss') {
  return moment(dataStr).format(pattern)
})

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  components: { App },
  template: '<App/>'
})
