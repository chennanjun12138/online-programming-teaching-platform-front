<template>
  <div>
    <el-container>
      <!-- 侧边栏   -->
      <el-aside :style="{ width: aSidewidth }" class="elside">
        <div class="sidehead">
          <img src="@/assets/logo.svg" class="sideimage">
          <span style="margin-left: 5px;font-size: 20px" v-show="!isCollapse">在线编程教学平台</span>
        </div>
        <el-menu :default-active="$route.path" router background-color="#001529" text-color="#fff"
          active-text-color="#ffd04b" :collapse="isCollapse" style="border: none">
          <el-menu-item index="/home">
            <el-icon>
              <House />
            </el-icon>
            <span slot="title">系统首页</span>
          </el-menu-item>
          <el-menu-item index="/person">
            <el-icon>
              <User />
            </el-icon>
            <span slot="title">个人中心</span>
          </el-menu-item>
          <el-menu-item index="/class" v-if="user.role === 'ROLE_ADMIN'">
            <el-icon>
              <Management />
            </el-icon>
            <span>课程管理</span>
          </el-menu-item>
          <el-menu-item index="/connectcontroller" v-if="user.role === 'ROLE_ADMIN'">
            <el-icon>
              <Connection />
            </el-icon>
            <span slot="title">课程关系管理</span>
          </el-menu-item>
          <el-menu-item index="/homework" v-if="user.role === 'ROLE_ADMIN'">
            <el-icon>
              <Management />
            </el-icon>
            <span slot="title">作业管理</span>
          </el-menu-item>
          <el-menu-item index="/program" v-if="user.role === 'ROLE_ADMIN'">
            <el-icon>
              <Setting />
            </el-icon>
            <span slot="title">题库管理</span>
          </el-menu-item>
          <el-menu-item index="/codeconroller" v-if="user.role === 'ROLE_ADMIN'">
            <el-icon>
              <Setting />
            </el-icon>
            <span slot="title">代码管理</span>
          </el-menu-item>
          <el-menu-item index="/user" v-if="user.role === 'ROLE_ADMIN'">
            <el-icon>
              <Setting />
            </el-icon>
            <span slot="title">用户管理</span>
          </el-menu-item>

          <el-menu-item index="/classteacher" v-if="user.role === 'ROLE_TEACHER'">
            <el-icon>
              <Reading />
            </el-icon>
            <span slot="title">课程管理</span>
          </el-menu-item>
          <el-menu-item index="/connectteacher" v-if="user.role === 'ROLE_TEACHER'">
            <el-icon>
              <Setting />
            </el-icon>
            <span slot="title">课程关系管理</span>
          </el-menu-item>
          <el-menu-item index="/teacherwork" v-if="user.role === 'ROLE_TEACHER'">
            <el-icon>
              <Management />
            </el-icon>
            <span slot="title">作业管理</span>
          </el-menu-item>
          <el-menu-item index="/homeworkteacher" v-if="user.role === 'ROLE_TEACHER'">
            <el-icon>
              <Medal />
            </el-icon><span slot="title">作业批改</span>
          </el-menu-item>
          <el-menu-item index="/bankteacher" v-if="user.role === 'ROLE_TEACHER'">
            <el-icon>
              <Setting />
            </el-icon>
            <span slot="title">题库管理</span>
          </el-menu-item>


          <el-menu-item index="/codeteacher" v-if="user.role === 'ROLE_TEACHER'">
            <el-icon>
              <Search />
            </el-icon><span slot="title">代码查看和评价</span>
          </el-menu-item>

          <el-menu-item index="/classlearn" v-if="user.role === 'ROLE_STUDENT'">
            <el-icon>
              <Reading />
            </el-icon><span slot="title">课程学习</span>
          </el-menu-item>
          <el-menu-item index="/question" v-if="user.role === 'ROLE_STUDENT'">
            <el-icon>
              <Collection />
            </el-icon><span slot="title">编程题库</span>
          </el-menu-item>
          <el-menu-item index="/gradework" v-if="user.role === 'ROLE_STUDENT'">
            <el-icon>
              <Folder />
            </el-icon>
            <span slot="title">作业测试</span>
          </el-menu-item>
          <el-menu-item index="/code" v-if="user.role === 'ROLE_STUDENT'">
            <el-icon>
              <Document />
            </el-icon><span slot="title">代码情况</span>
          </el-menu-item>
          <el-menu-item index="/leaderboard" v-if="user.role === 'ROLE_STUDENT'">
            <el-icon>
              <Trophy />
            </el-icon><span slot="title">排行榜</span>
          </el-menu-item>
          <el-menu-item index="/connectstudent" v-if="user.role === 'ROLE_STUDENT'">
            <el-icon>
              <Connection />
            </el-icon><span slot="title">课程关系</span>
          </el-menu-item>
        </el-menu>
      </el-aside>

      <el-container>
        <!-- 头部区域   -->
        <el-header>
          <el-icon style="width: 26px;" @click="handleCollapse">
            <Menu></Menu>
          </el-icon>
          <el-breadcrumb :separator-icon="ArrowRight" style="margin-left: 20px">
            <el-breadcrumb-item :to="{ path: '/home' }">系统首页</el-breadcrumb-item>
            <el-breadcrumb-item>{{ display }}</el-breadcrumb-item>
          </el-breadcrumb>
          <div class="headcotent">
            <el-icon style="font-size: 26px" @click="handlefull">
              <FullScreen />
            </el-icon>
            <el-dropdown placement="bottom">
              <div style="display: flex ; align-items: center;">
                <img v-if="user.photo" :src="'http://localhost:8080/api/files/' + user.photo"
                  style="width: 40px;height: 40px;margin: 0 5px ;border-radius: 50%;">
                <img v-else src="@/assets/logo.svg" style="width: 40px;height: 40px;margin: 0 5px ;border-radius: 50%;">
                <span class="el-dropdown-link" style="color: black; font-size: 16px">{{ user.name }}</span>
              </div>
              <template #dropdown>
                <el-dropdown-menu>
                  <el-dropdown-item>
                    <div @click="logout">退出登录</div>
                  </el-dropdown-item>
                </el-dropdown-menu>
              </template>
            </el-dropdown>
          </div>
        </el-header>
        <!-- 主体   -->
        <el-main>
          <router-view></router-view>
        </el-main>
      </el-container>
    </el-container>
  </div>
</template>

<script setup>
import { ref, computed } from "vue"
import { Connection, Setting, User, ArrowRight, Menu, FullScreen, House, Folder, Collection,Trophy, Document, Reading, Search, Medal, Management } from "@element-plus/icons-vue"
import { useRouter, useRoute } from "vue-router";

const router = useRouter()
const route = useRoute()
console.log(router.getRoutes(), route);

let aSidewidth = ref("200px");
const user = ref(localStorage.getItem("user") ? JSON.parse(localStorage.getItem("user")) : {})
let isCollapse = ref(false);
const display = computed(
  () => {
    const current = router.getRoutes().find(r => {
      console.log(route.name, r.name)
      if (route.name === 'questioncontent' || route.name === 'ClassDetail') {
        return route.path.includes(r.name)
      }
      else {
        return r.path === route.path
      }

    })

    if (current) {
      return current.meta.name;
    }
  }
)
function handleCollapse() {
  isCollapse.value = !isCollapse.value
  aSidewidth.value = isCollapse.value ? '64px' : '200px'

}
function handlefull() {
  document.documentElement.requestFullscreen()
}
function logout() {
  localStorage.removeItem("user");
  router.push("/login");
}

</script>

<style scoped>
.el-main {
  background-image: url('src/assets/image/b1.jpg');
  background-size: cover;
  /* 背景图片铺满整个页面 */
  background-repeat: no-repeat;
  /* 不重复显示背景图片 */
}

.elside {
  overflow: hidden;
  min-height: 100vh;
  background-color: #001529;
}

.sidehead {
  height: 60px;
  color: white;
  display: flex;
  align-items: center;
  justify-content: center
}

.sideimage {
  width: 30px;
  height: 30px
}

.el-menu--inline .el-menu-item {
  background-color: #000c17 !important;
}

.el-menu-item:hover,
.el-submenu__title:hover {
  color: #fff !important;
}

.el-submenu__title:hover i {
  color: #fff !important;

}

.el-menu {
  border-right: none !important;
}

.el-menu-item.is-active {

  background-color: #40a9ff !important;
  border-radius: 5px !important;
  width: calc(100% - 8px);
  margin-left: 4px;
}

.el-menu-item.is-active i,
.el-menu-item.is-active .el-tooltip {
  margin-left: -4px;
}

.el-menu-item {
  height: 40px !important;
  line-height: 40px !important;
  margin: 4px !important;
}

.el-submenu__title {
  height: 40px !important;
  line-height: 40px !important;
  margin: 4px !important;
}

.el-submenu__icon-arrow {
  position: relative;
  right: -40px;
  top: 2px;
}

.el-aside {
  transition: width .3s;
  box-shadow: 2px 0 6px rgba(0, 21, 41, .35);
}

.logo-title {
  margin-left: 5px;
  font-size: 20px;
  transition: all .3s;
}

.el-header {
  box-shadow: 2px 0 6px rgba(0, 21, 41, .35);
  display: flex;
  align-items: center;

}

.headcotent {
  flex: 1;
  width: 0;
  display: flex;
  align-items: center;
  justify-content: flex-end
}
</style>