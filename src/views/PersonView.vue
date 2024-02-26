<template>
    <div class="container">

        <el-card class="elcard" shadow="hover">

            <el-form label-width="80px" size="default">
                <div class="container">
                    <el-upload class="avatar-uploader" action="http://localhost:8080/api/files/upload"
                        :show-file-list="false" :on-success="successUpload">
                        <img v-if="user.photo" :src="'http://localhost:8080/api/files/' + user.photo" class="avatar">
                        <i v-else class="avatar" style="color: rgb(116, 118, 118);">
                            <CirclePlus />
                        </i>
                    </el-upload>
                </div>
                <el-form-item label="用户名" style="margin-top: 10px; margin-left: 200px; ">
                    <el-input v-model="user.name" autocomplete="off" style="width: 400px"></el-input>
                </el-form-item>
                <el-form-item label="密码" style="margin-left: 200px">
                    <el-input v-model="user.password" autocomplete="off" style="width: 400px"></el-input>
                </el-form-item>
                <el-form-item label="性别" style="margin-left: 200px">
                    <el-select v-model="user.sex" placeholder="请选择" autocomplete="off" style="width: 400px">
                        <el-option label="男" value="男"></el-option>
                        <el-option label="女" value="女"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="电话" style="margin-left: 200px">
                    <el-input v-model="user.phone" autocomplete="off" style="width: 400px"></el-input>
                </el-form-item>
                <el-form-item label="年龄" style="margin-left: 200px">
                    <el-input v-model="user.age" autocomplete="off" style="width: 400px"></el-input>
                </el-form-item>
                <el-form-item label="身份" style="margin-left: 200px; ">
                    <span style="text-align: left;">{{ display(user.role) }}</span>
                </el-form-item>

                <div class="container">
                    <el-button type="primary" @click="submit">保存</el-button>
                </div>
            </el-form>
        </el-card>
    </div>
</template>
    
<script setup >
import { ref } from 'vue';
import { changeuser, findusers } from "@/api/index.js";
import { CirclePlus } from "@element-plus/icons-vue"

let params = ref({
    name: '',
    phone: '',
    role: '',
    pageNum: 1,
    pageSize: 5
})
let total = ref(0);
let tableData = ref([]);
const user = ref(localStorage.getItem("user") ? JSON.parse(localStorage.getItem("user")) : {})
function findBySearch() {
    findusers(params.value).then(res => {
        if (res.code === '0') {
            tableData.value = res.data.list;
            total.value = res.data.total;
        } else {
        }
    })
}
findBySearch();
function display(res) {
    if (res === 'ROLE_STUDENT') {
        return "学生";
    }
    else if (res === 'ROLE_TEACHER') {
        return "教师";
    }
    else if (res === 'ROLE_ADMIN') {
        return "管理员";
    }
}
function successUpload(res) {
    user.value.photo = res.data;
}
function submit() {
    changeuser(user.value).then(res => {
        if (res.code === '0') {
            window.$message({
                message: '操作成功',
                type: 'success'
            });
            localStorage.setItem("user", JSON.stringify(user.value));

        } else {
            window.$message({
                message: res.msg,
                type: 'success'
            });
        }
    })
}

</script>
    
<style  scoped  lang="scss">
.elcard {
    height: 480px;
    width: 900px;
    margin-top: 5px;
    margin-left: 20px;
}

.avatar-uploader {
    display: inline-block;
    width: 100px;
    height: 100px;
    text-align: center;
    line-height: 100px;
    border-radius: 50%;
    border: 1px dashed #ccc;
    cursor: pointer;
}

.avatar {
    width: 100px;
    height: 100px;
    border-radius: 50%;
}
</style>