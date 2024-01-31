<template>
  <div>
    <div>
      <template v-if="user.role=== 'ROLE_STUDENT'" >
        <div v-for="(paragraph, index) in studentcontent" :key="index" class="multiline-text paragraph">
          {{ paragraph }}
        </div>
      </template>
      <template v-if="user.role=== 'ROLE_TEACHER'" >
        <div v-for="(paragraph, index) in teachercontent" :key="index" class="multiline-text paragraph">
          {{ paragraph }}
        </div>
      </template>
      <template v-if="user.role=== 'ROLE_ADMIN'" >
        <div v-for="(paragraph, index) in admincontent" :key="index" class="multiline-text paragraph">
          {{ paragraph }}
        </div>
      </template>

    </div>
  </div>

</template>

<script setup>
import request from "@/utils/request";
import {ref,reactive,computed} from "vue"

const  user=ref(localStorage.getItem("user") ? JSON.parse(localStorage.getItem("user")) : {})
const studentcontent=ref([
  '学生使用说明：',
  '个人中心：显示和修改个人信息，点击头像图片上传头像，点击保存按钮保存修改信息。',
  '课程学习：',
  '编程题库：',
  '作业测试：',
  '代码情况：'
],)
const teachercontent=ref([
  '教师使用说明：',
  '个人中心：显示和修改个人信息，点击头像图片上传头像，点击保存按钮保存修改信息。',
  '课程管理：',
  '题库管理：',
  '作业管理：',
  '作业批改：',
  '代码查看和评价：',
])
const admincontent=ref([
  '管理员使用说明：',
  '个人中心：显示和修改个人信息，点击头像图片上传头像，点击保存按钮保存修改信息。',
  '课程管理：',
  '作业管理：',
  '题库管理：',
  '用户管理：',
],)
 
</script>

<style scoped>
.multiline-text {
  white-space: pre-line;
}
.paragraph {
  margin-bottom: 10px; /* 设置段落之间的底部边距 */
}
</style>