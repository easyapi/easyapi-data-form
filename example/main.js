import Vue from 'vue'
import JsonForm from '../src/index.js'
import App from './App.vue'

Vue.use(JsonForm)


/* eslint-disable no-new */
new Vue({
  el: '#app',
  render: h => (h)(App)
})