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
import notfoundVue from '@/views/notfound.vue';
const router = createRouter({
   
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: "/login",
      name: "Login",
      meta:{name:"登录"},
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
          meta:{name:"个人中心"},
          name: 'person', component: PersonView,
        },
        {
          path: 'user',
          meta:{name:"用户管理"},
          name: 'user',component: AdminView
        },
        {
          path: 'class',
          meta:{name:"课程管理"},
          name: 'class',component: ClassView
        },
        {
          path: 'classlearn',
          meta:{name:"课程学习"},
          name: 'classlearn',component: ClasslearnView,

        },
        {
          path: 'ClassDetail/:fileId',
          name: 'ClassDetail',
          meta:{name:"课程详情"},
          component: ()=> import('@/views/student/ClassDetail.vue'),
        },
        {
          path: 'program',
          meta:{name:"题库管理"},
          name: 'program',component: QuestionbankcontrollerView
        },
        {
          path: 'question',
          meta:{name:"编程题库"},
          name: 'question',component: QuestionbankView
        },
        {
          path: 'questioncontent/:questionid',
          meta:{name:"题目详情"},
          name: 'questioncontent',component: ()=>import('@/views/QuestioncontentView.vue'),
        },
        {
          path: 'code',
          meta:{name:"代码情况"},
          name: 'code',component: codeView
        },
        {
          path: 'homework',
          meta:{name:"作业管理"},
          name: 'homework',component: HomeworkView
        },
        {
          path: 'gradework',
          meta:{name:"作业测试"},
          name: 'gradework',component: gradeworkView
        },
        {
          path: 'classteacher',
          meta:{name:"课程管理"},
          name: 'classteacher',component: ClassteacherView
        },
        {
          path: 'teacherwork',
          meta:{name:"作业管理"},
          name: 'teacherwork',component: teacherworkView
        },
        {
          path: 'codeteacher',
          meta:{name:"代码查看和评价"},
          name: 'codeteacher',component: codeteacherView
        },
        {
          path: 'homeworkteacher',
          meta:{name:"作业批改"},
          name: 'homeworkteacher',component: homeworkteacherView
        },
        {
          path: 'bankteacher',
          meta:{name:"题库管理"},
          name: 'bankteacher',component: QuestionbankteacherView
        },
      ]
    },
    { path: '/:pathMatch(.*)*', name: 'NotFound', component: notfoundVue },

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
