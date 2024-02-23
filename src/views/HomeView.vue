<template>
  <div>
    <div>
      <template v-if="user.role === 'ROLE_STUDENT'">
        <div v-for="(paragraph, index) in studentcontent" :key="index" class="multiline-text paragraph">
          {{ paragraph }}
        </div>
      </template>
      <template v-if="user.role === 'ROLE_TEACHER'">
        <div v-for="(paragraph, index) in teachercontent" :key="index" class="multiline-text paragraph">
          {{ paragraph }}
        </div>
      </template>
      <template v-if="user.role === 'ROLE_ADMIN'">
        <div v-for="(paragraph, index) in admincontent" :key="index" class="multiline-text paragraph">
          {{ paragraph }}
        </div>
      </template>

    </div>
  </div>
</template>

<script setup>
import request from "@/utils/request";
import { ref, reactive, computed } from "vue"

const user = ref(localStorage.getItem("user") ? JSON.parse(localStorage.getItem("user")) : {})
const studentcontent = ref([
  `学生端使用说明： 
   侧边栏显示平台各项功能，顶部栏左侧标签控制侧边栏收缩，右侧带点击放大图标进入全屏，移动到头像显示退出登录按钮 
   个人中心：显示和修改个人信息，点击头像图片上传头像，点击保存按钮保存修改信息。 
   课程学习： 
   编程题库： 
   作业测试： 
   代码情况：
   课程关系： `
],)
const teachercontent = ref([
  `教师端使用说明： 
   侧边栏显示平台各项功能，顶部栏左侧标签控制侧边栏收缩，右侧带点击放大图标进入全屏，移动到头像显示退出登录按钮 
   个人中心：显示和修改个人信息，点击头像图片上传头像，点击保存按钮保存修改信息。 
   课程管理： 
   课程关系管理：
   题库管理： 
   作业管理： 
   作业批改： 
   代码查看和评价：`,
])
const admincontent = ref([
  `管理员端使用说明： 
   侧边栏显示平台各项功能，顶部栏左侧标签控制侧边栏收缩，右侧带点击放大图标进入全屏，移动到头像显示退出登录按钮 
   个人中心：显示和修改个人信息，点击头像图片上传头像，点击保存按钮保存修改信息。 
   课程管理：
           表格中显示所有课程的课程封面、课程名、课程分类、课程教师和操作，可以通过课程名、课程教师和课程分类查询课程； 
           可以在顶部输入框中输入课程名、课程教师和课程分类然后点击查询按钮来查询具体课程，点击清空按钮去除所有查询条件，点击新建按钮新建课程,在左侧多选框中选择多个课程点击批量删除进行删除
           操作中的

   课程关系管理：      
   作业管理： 
   题库管理： 
   用户管理：`,
],)

</script>

<style scoped>
.multiline-text {
  white-space: pre-line;
}

.paragraph {
  margin-bottom: 10px;
  /* 设置段落之间的底部边距 */
}
</style>