import Vue from 'vue'
import VueRouter from 'vue-router'
import Home from '../views/Home.vue'
import category from '../views/category'
import categoryList from '../views/categoryList'
import product from '../views/product'
import buyCart from '../views/buyCart'
Vue.use(VueRouter)

const routes = [{
    path: '/',
    name: 'Home',
    component: Home
  },
  {
    path: '/about',
    name: 'About',
    // route level code-splitting
    // this generates a separate chunk (about.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: () => import( /* webpackChunkName: "about" */ '../views/About.vue')
  },
  {
    path: '/category',
    name: 'category',
    component: category
  },
  {
    path: '/categoryList/:id',
    name: 'categoryList',
    component: categoryList,
    props: true
  },
  {
    path: '/product/:id',
    name: 'product',
    component: product,
    props: true
  },
  {
    path: '/buyCart',
    name: 'buyCart',
    component: buyCart,
    props: true
  }
]

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
})

export default router