<template>
    <div>

        <div>
            <el-input v-model="params.name" style="width: 200px" placeholder="请输入姓名"></el-input>
            <el-input v-model="params.phone" style="width: 200px; margin-left: 5px" placeholder="请输入电话"></el-input>
            <el-select v-model="params.role" clearable placeholder="请选择角色" style="margin-left: 5px ;width: 200px; ">
                <el-option v-for="item in options" :key="item.value" :label="item.label" :value="item.value">
                </el-option>
            </el-select>
            <el-button type="warning" style="margin-left: 10px" @click="findBySearch()">查询</el-button>
            <el-button type="warning" @click="reset()">清空</el-button>
            <el-button type="primary" style="margin-left: 10px" @click="add()">新增</el-button>
            <el-popconfirm title="确定删除这些数据吗？" @confirm="delBatch()">
                <template #reference>
                    <el-button type="danger" style="margin-left: 5px">批量删除</el-button>
                </template>
            </el-popconfirm>
        </div>
        <div>
            <el-table :data="tableData" stripe style="width: 100%; margin: 15px 0px" ref="table"
                @selection-change="handleSelectionChange" :row-key="getRowKeys">
                <el-table-column ref="table" type="selection" width="55" :reserve-selection="true"></el-table-column>
                <el-table-column prop="name" label="姓名"></el-table-column>
                <el-table-column prop="sex" label="性别"></el-table-column>
                <el-table-column prop="age" label="年龄"></el-table-column>
                <el-table-column prop="phone" label="电话"></el-table-column>
                <el-table-column prop="role" label="角色">
                    <template #default="{ row }">
                        {{ maprol[row.role] }}
                    </template>
                </el-table-column>
                <el-table-column label="操作">
                    <template #default="{ row }">
                        <el-button type="primary" @click="edit(row)">编辑</el-button>

                        <el-popconfirm title="确定删除吗" @confirm="del(row.id)">
                            <template #reference>
                                <el-button type="danger" style="margin-left: 5px">删除</el-button>
                            </template>
                        </el-popconfirm>
                    </template>
                </el-table-column>
            </el-table>
        </div>
        <div style="margin-top: 10px">
            <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange"
                :current-page="params.pageNum" :page-sizes="[5, 10, 15, 20]" :page-size="params.pageSize"
                layout="total, sizes, prev, pager, next" :total="total">
            </el-pagination>
        </div>
        <div>
            <el-dialog title="请填写信息" v-model="dialogFormVisible" width="30%">
                <el-form :model="form">
                    <el-form-item label="姓名" label-width="15%">
                        <el-input v-model="form.name" autocomplete="off" style="width: 90%"></el-input>
                    </el-form-item>
                    <el-form-item label="性别" label-width="15%">
                        <el-radio v-model="form.sex" label="男">男</el-radio>
                        <el-radio v-model="form.sex" label="女">女</el-radio>
                    </el-form-item>
                    <el-form-item label="年龄" label-width="15%">
                        <el-input v-model="form.age" autocomplete="off" style="width: 90%"></el-input>
                    </el-form-item>
                    <el-form-item label="电话" label-width="15%">
                        <el-input v-model="form.phone" autocomplete="off" style="width: 90%"></el-input>
                    </el-form-item>
                    <el-form-item label="角色" label-width="15%">
                        <el-select v-model="form.role" placeholder="请选择" style="width: 90%">
                            <el-option label="教师" value="ROLE_TEACHER"></el-option>
                            <el-option label="学生" value="ROLE_STUDENT"></el-option>
                        </el-select>
                    </el-form-item>
                </el-form>
                <div class="container">
                    <el-button @click="dialogFormVisible = false">取 消</el-button>
                    <el-button type="primary" @click="submit()">确 定</el-button>
                </div>
            </el-dialog>
        </div>
    </div>
</template>
    
<script setup>
import { ref } from 'vue';
import { changeuser, findusers, deleteuser, delBatchuser } from "@/api/index.js";
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
const options = ref([{
    value: 'ROLE_STUDENT',
    label: '学生'
}, {
    value: 'ROLE_TEACHER',
    label: '教师'
}]);
const maprol = {
    ROLE_STUDENT: '学生',
    ROLE_TEACHER: '教师'
}
function findBySearch() {
    findusers(params.value).then(res => {
        if (res.code === '0') {
            tableData.value = res.data.list;
            console.log(tableData);
            total.value = res.data.total;
        }
    })
}
findBySearch();

function reset() {
    params.value = {
        pageNum: 1,
        pageSize: 5,
        name: '',
        phone: ''
    }
    findBySearch();
}
function handleSizeChange(pageSize) {
    params.value.pageSize = pageSize;
    findBySearch();
}

function handleCurrentChange(pageNum) {
    params.value.pageNum = pageNum;
    findBySearch();
}
function add() {
    form.value = {};
    dialogFormVisible.value = true;
}
function edit(obj) {
    form.value = obj;
    dialogFormVisible.value = true;
}
function submit() {
    changeuser(form.value).then(res => {
        if (res.code === '0') {
            window.$message({
                message: '操作成功',
                type: 'success'
            });
            dialogFormVisible.value = false;
            findBySearch();
        } else {
            window.$message({
                message: res.msg,
                type: 'success'
            });
        }
    })
}
function del(id) {
    deleteuser(id).then(res => {
        if (res.code === '0') {
            window.$message({
                message: '删除成功',
                type: 'success'
            });
            findBySearch();
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
                .findBySearch()
        } else {
            window.$message.error(res.msg)
        }
    })
}
function getRowKeys(row) {
    return row.id;
}
</script>
    
<style></style>