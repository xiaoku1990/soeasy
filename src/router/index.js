import Vue from 'vue'
import Router from 'vue-router'
import directerFindCar from '@/components/directerFindCar'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      name: 'directerFindCar',
      component: directerFindCar
    }
  ]
})
