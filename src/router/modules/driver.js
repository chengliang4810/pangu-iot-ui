import Layout from '@/layout'
/* 协议管理的路由 */
const authRouter = {
  path: '/driver',
  component: Layout,
  name: 'driver',
  alwaysShow: true,
  meta: {
    title: '驱动管理',
    icon: 'menu_agreement',
    active_icon: 'menu_agreement_ac'
  },
  children: [
    {
      path: '/driver/driver',
      component: () => import('@/views/driver/driver'),
      name: '/driver/driver',
      meta: {
        title: '驱动信息',
        icon24: 'module24',
        icon48: 'module48'
      }
    }
    // {
    //   path: '/agreement/communication',
    //   component: () => import('@/views/agreement/communication'),
    //   name: '/agreement/communication',
    //   meta: {
    //     title: '通信服务',
    //     icon24: 'communication24',
    //     icon48: 'communication48'
    //   }
    // },
    // {
    //   path: '/agreement/gateway',
    //   component: () => import('@/views/agreement/gateway'),
    //   name: '/agreement/gateway',
    //   meta: {
    //     title: '协议网关',
    //     icon24: 'gateway24',
    //     icon48: 'gateway48'
    //   }
    // }
  ]
}
export default authRouter
