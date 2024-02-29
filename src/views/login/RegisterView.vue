<template>
    <div :xl="6" :lg="7" class="bg-register">
        <div class="login-card">
            <div class="title">
                欢迎注册
            </div>
            <div class="form">
                <el-form :model="user" ref="formRef" size="default" :rules="rules">
                    <el-form-item prop="name">
                        <el-input v-model="user.name" :prefix-icon="User" placeholder="请输入用户名" />
                    </el-form-item>
                    <el-form-item prop="password">
                        <el-input v-model="user.password" :prefix-icon="Lock" placeholder="请输入密码" show-password />
                    </el-form-item>
                    <el-form-item prop="role">
                        <el-select v-model="user.role" placeholder="请选择" style="width: 100%">
                            <el-option label="教师" value="ROLE_TEACHER"></el-option>
                            <el-option label="学生" value="ROLE_STUDENT"></el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item>
                        <el-button type="primary" class="login-button" @click="Onregister()">注册</el-button>
                    </el-form-item>
                </el-form>
            </div>

            <div style="text-align: center">
                已有账号<a href="javascript:void(0)" style="text-decoration: none" @click="navlogin">点击登录</a>
            </div>
        </div>
    </div>
</template>

<script setup>
import { Setting, User, Lock, View } from "@element-plus/icons-vue"
import { ref, reactive, computed } from "vue"
import { login, register } from "@/api/index.js";
import { useRouter, RouterLink } from "vue-router";
import { validate } from '@/utils/validate'

const rules = ref({
    name: [{ required: true, message: '请输入用户名', trigger: 'blur' },],
    password: [{ required: true, message: '请输入密码', trigger: 'blur' },],
    role: [{ required: true, message: '请选择身份', trigger: 'blur' },]
})
const formRef = ref();
const router = useRouter()

const user = ref({});

function Onregister() {
    validate(formRef.value, () => {
        register(user.value).then(res => {
            
                window.$message({
                    message: '注册成功',
                    type: 'success'
                });
                router.push("/login");
            
        })
    })


}
function navlogin() {
    router.push("/login");
}
</script>

<style scoped>
.bg-register {
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

    font-size: 30px;
    font-weight: 500;
    line-height: 100px;
    color: #4a5ed0;
    flex-direction: row;
}

.image {
    width: 40px;
    height: 40px
}

.form {
    text-align: center;
    height: 320px;
    width: 320px;
}
</style>

