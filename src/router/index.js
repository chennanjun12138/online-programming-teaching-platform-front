import { createRouter, createWebHistory } from 'vue-router'
import LoginView from "@/views/login/LoginView.vue";
import RegisterView from "@/views/login/RegisterView.vue";
import Layout from "@/views/Layout.vue";
import HomeView from "@/views/HomeView.vue";
import AdminView from "@/views/admin/AdminView.vue";
import ClassView from "@/views/admin/ClassView.vue";
import PersonView from "@/views/PersonView.vue";
import ClasslearnView from "@/views/student/ClasslearnView.vue";
import QuestionbankcontrollerView from "@/views/admin/QuestionbankcontrollerView.vue";
import codeView from "@/views/student/codeView.vue";
import HomeworkView from "@/views/admin/HomeworkView.vue";
import QuestionbankView from "@/views/student/QuestionbankView.vue";
import ClassteacherView from "@/views/teacher/ClassteacherView.vue";
import teacherworkView from "@/views/teacher/teacherworkView.vue";
import codeteacherView from "@/views/teacher/codeteacherView.vue";
import homeworkteacherView from "@/views/teacher/HomeworkteacherView.vue";

import gradeworkView from "@/views/student/gradeworkView.vue";
import QuestionbankteacherView from "@/views/teacher/QuestionbankteacherView.vue";
const router = createRouter({
   
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: "/login",
      name: "Login",
      component: LoginView
    },
    {
      path: "/register",
      name: "Register",
      component: RegisterView
    },

    {
      path: "/",
      name: "Layout",
      component: Layout,
      children: [
        {
          path: 'home',
          name: 'home', component: HomeView,
        },
        {
          path: 'person',
          name: 'person', component: PersonView,
        },
        {
          path: 'user',
          name: 'user',component: AdminView
        },
        {
          path: 'class',
          name: 'class',component: ClassView
        },
        {
          path: 'classlearn',
          name: 'classlearn',component: ClasslearnView,

        },
        {
          path: 'ClassDetail/:fileId',
          name: 'ClassDetail',
          component: ()=> import('@/views/student/ClassDetail.vue'),
        },
        {
          path: 'program',
          name: 'program',component: QuestionbankcontrollerView
        },
        {
          path: 'question',
          name: 'question',component: QuestionbankView
        },
        {
          path: 'questioncontent/:questionid',
          name: 'questioncontent',component: ()=>import('@/views/QuestioncontentView.vue'),
        },
        {
          path: 'code',
          name: 'code',component: codeView
        },
        {
          path: 'homework',
          name: 'homework',component: HomeworkView
        },
        {
          path: 'gradework',
          name: 'gradework',component: gradeworkView
        },
        {
          path: 'classteacher',
          name: 'classteacher',component: ClassteacherView
        },
        {
          path: 'teacherwork',
          name: 'teacherwork',component: teacherworkView
        },
        {
          path: 'codeteacher',
          name: 'codeteacher',component: codeteacherView
        },
        {
          path: 'homeworkteacher',
          name: 'homeworkteacher',component: homeworkteacherView
        },
        {
          path: 'bankteacher',
          name: 'bankteacher',component: QuestionbankteacherView
        },
      ]
    }
  ]
})
 
// 路由守卫
router.beforeEach((to, from, next) => {
  if (to.path === '/login') {
    next();
  }

  const user = localStorage.getItem("user");
  if (!user && to.path !== '/login' && to.path !== '/register') {
    return next("/login");
  }
  next();
})
export default router
