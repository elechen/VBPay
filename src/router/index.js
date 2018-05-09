import Vue from 'vue'
import Router from 'vue-router'
import UnifiedPay from '@/components/UnifiedPay'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      name: 'UnifiedPay',
      component: UnifiedPay
    }
  ]
})
