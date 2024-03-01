<template>
  <div :xl="6" :lg="7" class="bg-login">
    <div class="login-card">
      <div class="title">
        <img src="@/assets/logo2.png" class="image">
        <span>在线编程教学平台</span>
      </div>
      <div class="form">
        <el-form :model="user" ref="formRef" size="default" :rules="rules">
          <el-form-item prop="name">
            <el-input v-model="user.name" :prefix-icon="User" placeholder="请输入用户名" />
          </el-form-item>
          <el-form-item prop="password">
            <el-input v-model="user.password" :prefix-icon="Lock" placeholder="请输入密码" show-password />
          </el-form-item>

          <el-form-item prop="email">
            <el-button type="primary" class="login-button" @click="onLogin">登录</el-button>
          </el-form-item>
        </el-form>
        <RouterLink to="/register" class="router-link">注册账号</RouterLink>
      </div>

    </div>
  </div>
</template>

<script setup>
import { User, Lock } from "@element-plus/icons-vue"
import { ref } from "vue"
import { login } from "@/api/index.js";
import { useRouter, RouterLink } from "vue-router";
import { validate } from '@/utils/validate'

const router = useRouter()

const user = ref({
  name: '',
  password: '',
});
const rules = ref({
  name: [{ required: true, message: '请输入用户名', trigger: 'blur' },],
  password: [{ required: true, message: '请输入密码', trigger: 'blur' },]
})
const formRef = ref();
function onLogin() {
  validate(formRef.value, () => {

    login(user.value).then(res => {
      if (res) {
        window.$message({
          message: '登录成功',
          type: 'success'
        });
        localStorage.setItem("user", JSON.stringify(res.data));
        router.push("/");

      }
    }

    )
  })

}
</script>

<style scoped>
.bg-login {
  width: 100%;
  height: 100%;
  background-image: url("src/assets/image/bg.jpg");
  background-size: 100% 100%;
  background-position: center;
  position: fixed;
  display: flex;
  justify-content: center;
  align-items: stretch;
}

.router-link {
  text-decoration: none;
  /* 去掉下划线 */

}

.login-card {
  width: 400px;
  height: 400px;
  background: #fff;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 0 20px;
  flex-direction: column;
  padding: 40px 20px;
  border-radius: 10px;
  height: 400px;
  margin: 100px auto;
}

.login-card .el-form {
  width: 100%;
}

.login-button {
  width: 100%;
}

.title {
  display: flex;
  align-items: center;
  /* 垂直居中对齐 */
  margin-bottom: 20px;
  font-size: 30px;
  font-weight: 500;
  line-height: 100px;
  color: #574ad0;
  flex-direction: row;
}

.image {
  width: 60px;
  height: 60px;

  align-items: center;
  justify-content: center;
}

.form {
  text-align: center;
  height: 320px;
  width: 320px;
}
</style>

