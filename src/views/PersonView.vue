<template>
    <div class="container">
        
        <el-card class="elcard" shadow="hover">

            <el-form label-width="80px" size="default">
                <div class="container">
                    <el-upload class="avatar-uploader" action="http://localhost:8080/api/files/upload"
                        :show-file-list="false" :on-success="successUpload">
                        <img v-if="user.photo" :src="'http://localhost:8080/api/files/' + user.photo" class="avatar">
                       <!--   <i v-else class="el-icon-plus avatar-uploader-icon"></i> -->
                        <i v-else  class="avatar" style="color: rgb(116, 118, 118);" ><CirclePlus /></i>
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
import { changeuser, delBatchuser, findusers } from "@/api/index.js";
import { CirclePlus  } from "@element-plus/icons-vue"
import Chart from '@/components/Chart.vue';

let params = ref({
    name: '',
    phone: '',
    role: '',
    pageNum: 1,
    pageSize: 5
})
let total = ref(0);
let tableData = ref([]);
let dialogFormVisible = ref(false);
let form = ref({})
let multipleSelection = ref([]);
const defaultAvatar = ref('@/assets/logo.svg')
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

function handleSizeChange(pageSize) {
    params.value.pageSize = pageSize;
    findBySearch();
}
function handleCurrentChange(pageNum) {
    params.value.pageNum = pageNum;
    findBySearch();
}
function edit(obj) {
    form.value = obj;
    dialogFormVisible.value = true;
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

function handleSelectionChange(val) {
    multipleSelection.value = val;
}
function delBatch() {
    if (multipleSelection.value.length === 0) {
        window.$message.warning("请勾选您要删除的项")
        return
    }
    delBatchuser(multipleSelection.value).then(res => {
        if (res.code === '0') {
            window.$message.success("批量删除成功")
            findBySearch()
        } else {
            window.$message.error(res.msg)
        }
    })
}
function getRowKeys(row) {
    return row.id;
}
</script>
    
<style>
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

.container {
    display: flex;
    align-content: center;
    justify-content: center;

}
</style>