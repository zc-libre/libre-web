import Vue from 'vue'
import Storage from '@/utils/storage'
import 'normalize.css/normalize.css'
// element ui
import Element from 'element-ui'
// editor
import mavonEditor from 'mavon-editor'
import 'mavon-editor/dist/css/index.css'
// 数据字典
import dict from './components/Dict'
// 权限指令
import permission from './components/Permission'
import './assets/styles/element-variables.scss'
// global css
import './assets/styles/index.scss'
// 代码高亮
import VueHighlightJS from 'vue-highlightjs'
import 'highlight.js/styles/atom-one-dark.css'

import App from './App'
import store from './store'
import router from './router/routers'

import './assets/icons' // icon
import './router/index' // permission control
import 'echarts-gl'
import VueVideoPlayer from 'vue-video-player'

// 引入样式
import 'video.js/dist/video-js.css'
import 'vue-video-player/src/custom-theme.css'

import hls from "videojs-contrib-hls";

// 使用组件
Vue.use(VueVideoPlayer)
Vue.use(hls)


Vue.use(VueHighlightJS)
Vue.use(mavonEditor)
Vue.use(permission)
Vue.use(dict)
Vue.use(Element, {
  size: Storage.get('size') || 'small', // set element-ui default size
})

Vue.config.productionTip = false

new Vue({
  el: '#app',
  router,
  store,
  render: (h) => h(App),
})
