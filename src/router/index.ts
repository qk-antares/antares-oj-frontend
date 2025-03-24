import { useUserStore } from '@/stores'
import HomeView from '@/views/home/HomeView.vue'
import LoginView from '@/views/login/LoginView.vue'
import ProblemView from '@/views/problem/ProblemView.vue'
import { createRouter, createWebHistory } from 'vue-router'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      redirect: '/problemset',
    },
    {
      path: '/login',
      name: 'login',
      component: LoginView,
      meta: {
        layout: 'login',
      },
    },
    {
      path: '/problemset',
      name: 'problemset',
      component: HomeView,
    },
    {
      path: '/problem/:problemId(\\d+)',
      name: 'problem',
      component: ProblemView,
      props: route => ({
        problemId: Number(route.params.problemId),
      }),
      meta: {
        layout: 'problem',
      },
    },
    {
      path: '/admin',
      redirect: '/admin/problemset',
    },
    {
      path: '/admin/problemset',
      name: 'adminProblemset',
      component: () => import('@/views/admin/AdminView.vue'),
      children: [
        {
          path: '',
          name: 'adminProblemsetTable',
          component: () => import('@/views/admin/components/ProblemTable.vue'),
        },
        {
          path: '/admin/problemset/:operation/:problemId(\\d+)?',
          name: 'adminProblem',
          component: () => import('@/views/admin/components/ProblemEditor.vue'),
          props: route => ({
            operation: route.params.operation,
            // 转换为 number
            problemId: route.params.problemId
              ? Number(route.params.problemId)
              : undefined,
          }),
        },
      ],
    },
  ],
})

// 设置全局路由守卫
router.beforeEach(async (to, from, next) => {
  const userStore = useUserStore()

  // 登录态为 true
  if (userStore.isLoggedIn) {
    if (to.name === 'login') {
      return next({ name: 'problemset' })
    }
    return next()
  }

  // 登录态为false，首先根据token刷新用户状态
  await userStore.refresh()
  // 后端验证登录
  if (userStore.isLoggedIn) {
    if (to.name === 'login') {
      return next({ name: 'problemset' })
    }
    return next()
  }

  // 确实没登录
  return next({ name: 'login' })
})

export default router
