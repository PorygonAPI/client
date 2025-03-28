import { createRouter, createWebHistory } from 'vue-router'
import LoginView from '../views/LoginView.vue'
import MenuView from '../views/MenuView.vue'
import ErrorView from '../views/ErrorView.vue'
import HomeView from '@/views/HomeView.vue'
import AdmUsersView from '@/views/AdmUsersView.vue'
import UserRegisterForm from '@/components/UserRegisterForm.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'login',
      component: LoginView
    },
    {
      path: '/menu',
      name: 'menu',
      component: MenuView,
      meta: { requiresAuth: true }
    },
    {
      path: '/error',
      name: 'error',
      component: ErrorView
    },
    {
      path:'/home',
      name:'home',
      component: HomeView,
    },
    {
      path:'/usuario',
      name:'usuario',
      component:AdmUsersView,
    },
    {
      path: '/cadastroUsuario',
      name: 'cadastroUsuario',
      component: UserRegisterForm
    }
  ]
})

router.beforeEach((to, from, next) => {
  const token = localStorage.getItem('token')

  if (to.meta.requiresAuth && !token) {
    next({ name: 'login' })
  } else {
    next()
  }
})

export default router
