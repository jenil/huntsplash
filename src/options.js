import Vue from 'vue'
var VueResource = require('vue-resource');
import App from '@/components/options'

Vue.use(VueResource);

new Vue({
  el: '#app',
  render: h => h(App)
})
