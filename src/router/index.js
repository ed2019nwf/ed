import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

/* Layout */
import Layout from '@/layout'

/**
 * Note: sub-menu only appear when route children.length >= 1
 * Detail see: https://panjiachen.github.io/vue-element-admin-site/guide/essentials/router-and-nav.html
 *
 * hidden: true                   if set true, item will not show in the sidebar(default is false)
 * alwaysShow: true               if set true, will always show the root menu
 *                                if not set alwaysShow, when item has more than one children route,
 *                                it will becomes nested mode, otherwise not show the root menu
 * redirect: noRedirect           if set noRedirect will no redirect in the breadcrumb
 * name:'router-name'             the name is used by <keep-alive> (must set!!!)
 * meta : {
    roles: ['admin','editor']    control the page roles (you can set multiple roles)
    title: 'title'               the name show in sidebar and breadcrumb (recommend set)
    icon: 'svg-name'             the icon show in the sidebar
    breadcrumb: false            if set false, the item will hidden in breadcrumb(default is true)
    activeMenu: '/example/list'  if set path, the sidebar will highlight the path you set
  }
 */

/**
 * constantRoutes
 * a base page that does not have permission requirements
 * all roles can be accessed
 */
export const constantRoutes = [
  {
    path: '/login',
    component: () => import('@/views/login/index'),
    hidden: true
  },

  {
    path: '/404',
    component: () => import('@/views/404'),
    hidden: true
  },
  {
    path: '/',
    component: Layout,
    redirect: '/home',
    children: [{
      path: 'home',
      name: 'home',
      component: () => import('@/views/home/index'),
      meta: { title: '首页', icon: 'example' }
    }]
  },
  {
    path: '/user',
    component: Layout,
    redirect: '/user/userlist',
    name: 'User',
    meta: { title: '用户管理', icon: 'example' },
    children: [
      {
        path: 'agentlist',
        name: 'AgentList',
        component: () => import('@/views/user/agent'),
        meta: { title: '代理列表', icon: 'tree' }
      },{
        path: 'userlist',
        name: 'Userlist',
        component: () => import('@/views/user/userlist'),
        meta: { title: '用户信息列表', icon: 'tree' }
      },
      {
        path: 'userlevel',
        name: 'userlevel',
        component: () => import('@/views/user/userlevel'),
        meta: { title: '用户等级列表', icon: 'tree' }
      },
      {
        path: 'cashreport',
        name: 'cashreport',
        component: () => import('@/views/user/cashreport'),
        meta: { title: '用户现金报表', icon: 'tree' }
      },
      {
        path: 'betreport',
        name: 'betreport',
        component: () => import('@/views/user/betreport'),
        meta: { title: '用户投注报表', icon: 'tree' }
      }
    ]
  },
  {
    path: '/content',
    component: Layout,
    redirect: '/content/activelist',
    name: 'Content',
    meta: { title: '内容管理', icon: 'example' },
    children: [
      {
        path: 'activelist',
        name: 'activelist',
        component: () => import('@/views/content/activelist'),
        meta: { title: '活动列表', icon: 'tree' }
      },
      {
        path: 'noticelist',
        name: 'noticelist',
        component: () => import('@/views/content/noticelist'),
        meta: { title: '公告信息', icon: 'tree' }
      }
    ]
  },
  {
    path: '/money',
    component: Layout,
    redirect: '/money/order_crk',
    name: 'Money',
    meta: { title: '财务管理', icon: 'example' },
    children: [
      {
        path: 'order_crk',
        component: () => import('@/views/money/order_crk'),
        meta: { title: '出入款订单列表', icon: 'tree' }
      },
      {
        path: 'order_zb',
        component: () => import('@/views/money/order_zb'),
        meta: { title: '账变记录', icon: 'tree' }
      },
      {
        path: 'pay_list',
        component: () => import('@/views/money/pay_list'),
        meta: { title: '支付配置列表', icon: 'tree' }
      },
      {
        path: 'hand_pay_list',
        component: () => import('@/views/money/hand_pay_list'),
        meta: { title: '手工支付配置列表', icon: 'tree' }
      }
    ]
  },
  {
    path: '/lottery',
    component: Layout,
    redirect: '/lottery/issuelist',
    name: 'Lottery',
    meta: { title: '彩票管理', icon: 'example' },
    children: [
      {
        path: 'issuelist',
        name: 'issuelist',
        component: () => import('@/views/lottery/issuelist'),
        meta: { title: '期号信息列表', icon: 'tree' }
      },
      {
        path: 'order_tz',
        component: () => import('@/views/lottery/order_tz'),
        meta: { title: '投注列表', icon: 'tree' }
      },
      {
        path: 'lobby_set',
        name: 'lobbySet',
        component: () => import('@/views/lottery/lobby_set'),
        meta: { title: '游戏大厅配置', icon: 'tree' }
      },
      {
        path: 'betconf',
        name: 'betconf',
        component: () => import('@/views/lottery/betconf'),
        meta: { title: '游戏大厅投注配置', icon: 'tree' }
      }
    ]
  },

  // 404 page must be placed at the end !!!
  { path: '*', redirect: '/404', hidden: true }
]

const createRouter = () => new Router({
  // mode: 'history', // require service support
  scrollBehavior: () => ({ y: 0 }),
  routes: constantRoutes
})

const router = createRouter()

// Detail see: https://github.com/vuejs/vue-router/issues/1234#issuecomment-357941465
export function resetRouter() {
  const newRouter = createRouter()
  router.matcher = newRouter.matcher // reset router
}

export default router
