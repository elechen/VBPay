import Vue from 'vue'
import Router from 'vue-router'
import UnifiedPay from '@/components/UnifiedPay'
import PayResult from '@/components/PayResult'

Vue.use(Router)

export default new Router({
  routes: [{
    path: '/',
    name: 'UnifiedPay',
    component: UnifiedPay
  },
  {
    path: '/payresult',
    name: 'PayResult',
    component: PayResult
  }
  ]
})
