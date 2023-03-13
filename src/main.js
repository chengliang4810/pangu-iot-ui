import Vue from 'vue'
import 'normalize.css/normalize.css' // A modern alternative to CSS resets
import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
import '@/styles/index.scss' // global css
import '@/styles/common.scss'
import '@/styles/element-variables.scss'
import '@/icons' // icon
import './utils/directives.js'
import '@/permission' // permission control
// import VueSocketIO from 'vue-socket.io'
import moment from 'dayjs'
import mqtt from 'mqtt'
import App from './App'
import router from './router'
import store from './store'
import VueClipboard from 'vue-clipboard2'
// 字典标签组件
import DictTag from '@/components/DictTag'
import DictData from '@/components/DictData'
import { selectDictLabel, handleTree } from '@/utils/pangu'
DictData.install()

Vue.prototype.handleTree = handleTree
Vue.prototype.selectDictLabel = selectDictLabel
Vue.use(ElementUI)
Vue.use(VueClipboard)

// 连接选项
const options = {
  clean: true, // true: 清除会话, false: 保留会话
  connectTimeout: 4000, // 超时时间
  // 认证信息
  clientId: 'webui-' + new Date().getTime(),
  username: 'web',
  password: '8d969eef6ecad3c29a3a629280e686cf0c3f5d5a86aff3ca12020c923adc6c92'
}

const connectUrl = 'ws://10.0.0.34:8083/mqtt'
const client = mqtt.connect(connectUrl, options)
Vue.prototype.$mqttClient = client
Vue.prototype.moment = moment
Vue.config.productionTip = false
Vue.prototype.$stringToHex = function(str) {
  const arr = []
  for (let i = 0; i < str.length; i++) {
    arr.push(str.charCodeAt(i).toString(16))
  }
  return arr.join('')
}
new Vue({
  el: '#app',
  router,
  store,
  render: (h) => h(App)
})

Vue.component('DictTag', DictTag)
