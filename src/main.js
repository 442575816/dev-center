import Vue from 'vue'

import ElementUI from 'element-ui'
import 'element-ui/lib/theme-default/index.css'
// import 'element-ui/lib/theme-chalk/index.css'

import App from './App'

import router from './router'
import store from './store'
import './permission'


import 'font-awesome/css/font-awesome.min.css'
import { directive } from 'namedavatar/src/vue'

Vue.use(ElementUI)

// register as directive
Vue.directive('avatar', directive);

new Vue({
  //el: '#app',
  //template: '<App/>',
  router,
  store,
  //components: { App }
  render: h => h(App)
}).$mount('#app')

