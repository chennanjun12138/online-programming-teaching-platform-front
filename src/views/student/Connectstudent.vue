<template>
    <div>

        <div>
            <el-input v-model="params.teachername" style="width: 200px" placeholder="请输入教师名"></el-input>
            <el-button type="warning" style="margin-left: 10px" @click="findBySearch()">查询</el-button>
            <el-button type="warning" @click="reset()">清空</el-button>
            <el-button type="primary" style="margin-left: 10px" @click="add()">新增</el-button>

        </div>
        <div>
            <el-table :data="tableData" stripe style="width: 100%; margin: 15px 0px" ref="table"
                @selection-change="handleSelectionChange" :row-key="getRowKeys">
                <el-table-column prop="classid" label="课程id"></el-table-column>
                <el-table-column prop="teacherid" label="教师id"></el-table-column>
                <el-table-column prop="teachername" label="教师名"></el-table-column>
                <el-table-column prop="studentname" label="学生名"></el-table-column>
                <el-table-column label="操作">
                    <template #default="{ row }">

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
            <el-dialog title="请填写信息" v-model="dialogFormVisible" width="40%">
                <el-form :model="form">
                    <el-form-item label="课程id" label-width="15%">
                        <el-select v-model="form.classid" clearable placeholder="请选择课程" style="width: 90%">
                            <el-option v-for="item in options" :key="item.value" :label="item.label" :value="item.value">
                            </el-option>
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
import { findconnects, deleteconnect, addconnect, findclassall, findByname } from "@/api/index.js";

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
const user = ref(localStorage.getItem("user") ? JSON.parse(localStorage.getItem("user")) : {})
let options = ref([])
let ans = ref({})
let classes = ref([])
findBySearch();
function findBySearch() {
    params.value.studentid = user.value.id;
    findconnects(params.value).then(res => {
        if (res) {
            tableData.value = res.data.list;
            total.value = res.data.total;
        }
    })
    options.value=[]
    findclassall(params.value).then(res => {
        if (res) {
            
            for (let i = 0; i < res.data.length; i++) {
                ans.value = {
                    value: res.data[i].id,
                    label: "课程" + res.data[i].id+" : "+res.data[i].name
                }
                options.value.push(ans.value);
               
            }
            classes.value = res.data;
        }
    }) 
    
}

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

function submit() {
    for (let i = 0; i < classes.value.length; i++) {
        if (form.value.classid === classes.value[i].id) {
            form.value.teachername = classes.value[i].author;
            findByname(form.value.teachername).then(
                res => {
                    if (res) {
                        form.value.teacherid = res.data.id;
                    }
                }
            )
        }
    }
    // console.log(form.value.classid)
    form.value.studentid = user.value.id;
    form.value.studentname = user.value.name;

    addconnect(form.value).then(res => {
        if (res) {

            if (res.data === 0) {

                window.$message({
                    message: '该课程早已添加',
                    type: 'success'
                });

            }
            else {

                window.$message({
                    message: '添加成功',
                    type: 'success'
                });
            }

            dialogFormVisible.value = false;
            findBySearch();
        }
    })
}
function getRowKeys(row) {
    return row.id;
}
function del(id) {
    deleteconnect(id).then(res => {
        if (res) {
            window.$message({
                message: '删除成功',
                type: 'success'
            });
            findBySearch();
        }
    })
}
</script>
    
<style></style>