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
                <el-form-item label="身份:" style="margin-left: 200px; ">
                    <span style="text-align: left;">{{ display(user.role) }}</span>
                    <span style="text-align: left; margin-left: 15px;">提交数:{{ submitnum }}</span>
                    <span style="text-align: left; margin-left: 15px;">AC数:{{ solvenum }}</span>
                </el-form-item>

                <div class="container">
                    <el-button type="primary" @click="changepassword()">修改密码</el-button>
                    <el-button type="primary" @click="submit">保存</el-button>
                </div>
            </el-form>
        </el-card>
        <el-dialog title="请填写信息" v-model="dialogFormVisible">
            <el-form :model="form">
                <el-form-item label="原密码" label-width="15%">
                    <el-input v-model="form.passwordOld" autocomplete="off" style="width: 90%" show-password></el-input>
                </el-form-item>

                <el-form-item label="新密码" label-width="15%">
                    <el-input v-model="form.passwordNew" autocomplete="off" style="width: 90%" show-password></el-input>
                </el-form-item>
                <el-form-item label="确认密码" label-width="15%">
                    <el-input v-model="form.passwordSure" autocomplete="off" style="width: 90%"
                        show-password></el-input>
                </el-form-item>
            </el-form>
            <div class="container">
                <el-button @click="dialogFormVisible = false">取 消</el-button>
                <el-button type="primary" @click="submitpassword()">确 定</el-button>
            </div>
        </el-dialog>
    </div>
</template>

<script setup>
import { ref } from 'vue';
import { changeuser, getallsubmit, updatepassword } from "@/api/index.js";
import { CirclePlus } from "@element-plus/icons-vue"
import { useRouter } from "vue-router";

let params = ref({
    name: '',
    phone: '',
    role: '',
    pageNum: 1,
    pageSize: 5
})
let tableData = ref([])
let submitnum = ref(0)
let solvenum = ref(0)
let dialogFormVisible = ref(false);
let form = ref({})
const router = useRouter()
const user = ref(localStorage.getItem("user") ? JSON.parse(localStorage.getItem("user")) : {})
function changepassword() {
    dialogFormVisible.value = true;
}
function submitpassword() {
    form.value.name = user.value.name;
    updatepassword(form.value).then(res => {
        if (res) {
            window.$message({
                message: '密码修改成功',
                type: 'success'
            });
            dialogFormVisible.value = false;
            localStorage.removeItem("user");
            router.push("/login");
        }
    }

    )

}
function findBySearch() {
    params.value.userid = user.value.id;
    getallsubmit(params.value).then(res => {

        tableData.value = res.data;
        submitnum.value = res.data.length;

        for (let i = 0; i < res.data.length; i++) {

            tableData.value[i].judgeInfo = JSON.parse(tableData.value[i].judgeInfo);
            console.log(tableData.value[i].judgeInfo.message);
            if (tableData.value[i].judgeInfo.message == "Accepted") {
                solvenum.value = solvenum.value + 1;
            }
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
        window.$message({
            message: '操作成功',
            type: 'success'
        });
        localStorage.setItem("user", JSON.stringify(user.value));
    })
}

</script>

<style scoped lang="scss">
.elcard {
    height: 480px;
    width: 900px;
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