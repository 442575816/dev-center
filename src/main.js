import Vue from 'vue'

import ElementUI from 'element-ui'
import 'element-ui/lib/theme-default/index.css'

import App from './App'
// import VueRouter from 'vue-router'
import router from './router'
import store from './store'
// import Vuex from 'vuex'

import './permission'

// import routes from './routes'

import 'font-awesome/css/font-awesome.min.css'
import { directive } from 'namedavatar/src/vue'

Vue.use(ElementUI)
// Vue.use(VueRouter)
// Vue.use(Vuex)

// register as directive
Vue.directive('avatar', directive);
//NProgress.configure({ showSpinner: false });

// const router = new VueRouter({
//   routes
// })

// router.beforeEach((to, from, next) => {
//   //NProgress.start();
//   if (to.path == '/login') {
//     sessionStorage.removeItem('user');
//   }
//   let user = JSON.parse(sessionStorage.getItem('user'));
//   if (!user && to.path != '/login') {
//     next({ path: '/login' })
//   } else {
//     next()
//   }
// })

//router.afterEach(transition => {
//NProgress.done();
//});

new Vue({
  //el: '#app',
  //template: '<App/>',
  router,
  store,
  //components: { App }
  render: h => h(App)
}).$mount('#app')

