import Vue from 'vue'
import VueRouter from 'vue-router'
import Home from '../views/Home.vue'
import About from '../views/About.vue'
import Live from '../views/Live.vue'
import Video from '../views/Video.vue'
import Friend from '../views/Friend.vue'
import ListDetail from '../views/Detail.vue'
import Search from '../views/Search.vue'
import MVDetail from '../views/MVDetail.vue'
import TuiJian from '../components/content/tuijian/TuiJian.vue'
import GeDan from '../components/content/gedan/GeDan.vue'
import PaiHang from '../components/content/paihangbang/PaiHang.vue'
import GeShou from '../components/content/geshou/GeShou.vue'
import ZuiXin from '../components/content/zuixin/ZuiXin.vue'
import DianTai from '../components/content/diantai/DianTai.vue'
// import ShiPin from '../components/content/shipin/ShiPin.vue'
// import MV from '../components/content/MV/MV.vue'
Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    redirect: '/home'
  },
  {
    path: '/home',
    component: Home,
    children:[
      {
        path: '/',
        redirect: '/home/tuijian'
      },
      {
        path: '/home/tuijian',
        component: TuiJian
      },
      {
        path: '/home/gedan',
        component: GeDan
      },
      {
        path: '/home/paihang',
        component: PaiHang
      },
      {
        path: '/home/geshou',
        component: GeShou
      },
      {
        path: '/home/zuixin',
        component: ZuiXin
      },
      {
        path: '/home/diantai',
        component: DianTai
      }
    ]
  },
  {
    path: '/about',
    component: About
  },
  {
    path: '/live',
    component: Live
  },
  {
    path: '/video',
    component: Video,
  },
  {
    path: '/MVDetail/:id',
    component: MVDetail,
  },
  {
    path: '/friend',
    component: Friend
  },
  {
    path:'/listdetail/:iid',
    component: ListDetail
  },
  {
    path:'/search/:name',
    component:Search
  }
]

const router = new VueRouter({
  mode: 'hash',
  base: process.env.BASE_URL,
  routes,

})

export default router
