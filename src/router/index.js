import { createRouter, createWebHistory } from 'vue-router'
import LoginView from '../views/LoginView.vue'
import MenuView from '../views/MenuView.vue'
import ErrorView from '../views/ErrorView.vue'
import HomeView from '@/views/HomeView.vue'
import AdmUsersView from '@/views/AdmUsersView.vue'
import AreasAgricolasView from '@/views/AreasAgricolasView.vue'
import VetoresView from '@/views/VetoresView.vue'
import DashboardView from '@/views/DashboardView.vue'
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
      meta: { requiresAuth: true }
    },
    {
      path:'/usuario',
      name:'usuario',
      component:AdmUsersView,
    },
    {
      path:'/areasagro',
      name:'areasagro',
      component:AreasAgricolasView,
    },
    {
      path:'/vetor',
      name:'vetor',
      component:VetoresView,
    },
    {
      path:'/dashboard',
      name:'dashboard',
      component:DashboardView,
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
