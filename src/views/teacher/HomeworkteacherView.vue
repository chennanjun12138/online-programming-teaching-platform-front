<template>
    <div>

        <div>
            <el-input v-if="tableVisible" v-model="params.name" style="width: 200px" placeholder="请输入作业名"></el-input>
            <el-button v-if="tableVisible" type="primary" style="margin-left: 10px" @click="findBySearch()"
                :icon="Search">查询</el-button>
            <el-button v-if="tableVisible2" type="warning" style="margin-left: 10px" @click="findBySearch()"
                :icon="Back">返回</el-button>
            <el-button v-if="tableVisible" type="warning" @click="reset()">清空</el-button>


        </div>
        <div>
            <el-table :header-cell-style="{ textAlign: 'center',background: '#eef1f6', color: '#606266' }" :data="tableData"
                v-if="tableVisible" style="width: 100%; margin: 15px 0px" ref="table" :cell-style="{ textAlign: 'center' }"
                @selection-change="handleSelectionChange" :row-key="getRowKeys">
                <el-table-column width="70px" prop="homeworkid" label="作业号"></el-table-column>
                <el-table-column prop="name" label="作业名"></el-table-column>
                <el-table-column prop="teacher" label="作业教师" width="80px"></el-table-column>
                <el-table-column prop="starttime" label="开始时间"></el-table-column>
                <el-table-column prop="endtime" label="结束时间"></el-table-column>
                <el-table-column label="操作">
                    <template #default="{ row }">
                        <el-button type="primary" @click="searchsubmit(row.homeworkid)" :icon="Search">查看提交</el-button>
                        <el-popconfirm title="确定删除吗？" @confirm="del(row.homeworkid)">
                            <template #reference>
                                <el-button type="danger" style="margin-left: 5px" :icon="Delete">删除</el-button>
                            </template>
                        </el-popconfirm>
                    </template>
                </el-table-column>
            </el-table>
            <el-table v-if="tableVisible2" :header-cell-style="{textAlign: 'center', background: '#eef1f6', color: '#606266' }"
                :data="submitdata" style="width: 100%; margin: 15px 0px" ref="table":cell-style="{ textAlign: 'center' }"
                @selection-change="handleSelectionChange" :row-key="getRowKeys">
                <el-table-column width="80px" prop="id" label="提交序号"></el-table-column>

                <el-table-column prop="studentname" label="提交人"></el-table-column>
                <el-table-column prop="submittime" label="提交时间"></el-table-column>
                <el-table-column prop="content" label="提交内容"></el-table-column>
                <el-table-column label="操作">
                    <template #default="{ row }">
                        <el-button type="primary" @click="add($index, row.id)">批改</el-button>
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
                    <el-form-item label="评分" label-width="25%">
                        <el-input v-model="form.score" style="width: 90%"></el-input>
                    </el-form-item>
                    <el-form-item label="教师评价" label-width="25%">
                        <el-input v-model="form.teacherevaluate" style="width: 90%" type="textarea"></el-input>
                    </el-form-item>
                </el-form>
                <div class="container">
                    <el-button type="info" @click="dialogFormVisible = false">取 消</el-button>
                    <el-button type="primary" @click="submit()">确 定</el-button>
                </div>
            </el-dialog>
        </div>
    </div>
</template>

<script setup>
import { ref } from 'vue';
import { Search, Delete, Back } from '@element-plus/icons-vue'

import {
    changesubmit,
    delBatchhomework,
    deletehomework,
    findsubmit,
    findhomeworks,
    updatehomework,
} from "@/api/index.js";
let params = ref({
    name: '',
    phone: '',
    teacher: '',
    pageNum: 1,
    pageSize: 5,
    content: '',
    homeworkid: 0,
})
let total = ref(0);
let tableData = ref([]);
let submitdata = ref([]);
let tableVisible = ref(true);
let tableVisible2 = ref(false);
let multipleSelection = ref([]);
let dialogFormVisible = ref(false);
let form = ref({})

const user = ref(localStorage.getItem("user") ? JSON.parse(localStorage.getItem("user")) : {})
function findBySearch() {

    params.value.teacher = user.value.name;
    findhomeworks(params.value).then(res => {
        if (res) {

            tableData.value = res.data.list;
            total.value = res.data.total;

            tableVisible.value = true;
            tableVisible2.value = false;
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
function searchsubmit(id) {

    params.value.homeworkid = id;
    findsubmit(params.value).then(res => {
        if (res) {
            submitdata.value = res.data.list;
            total.value = res.data.total;
            tableVisible.value = false;
            tableVisible2.value = true;
        }
    })
}
function add(id, submitid) {
    form.value = {};
    form.value.id = submitid;

    form.value.score = submitdata.value[id]?.score;
    form.value.teacherevaluate = submitdata.value[id]?.teacherevaluate;
    dialogFormVisible.value = true;
}

function submit() {
    changesubmit(form.value).then(res => {
        if (res) {
            window.$message({
                message: '操作成功',
                type: 'success'
            });
            dialogFormVisible.value = false;
        }
    })
}
function del(id) {
    deletehomework(id).then(res => {
        if (res) {
            window.$message({
                message: '删除成功',
                type: 'success'
            });
            findBySearch();
        }
    })
}
function handleSelectionChange(val) {
    multipleSelection.value = val;
}


function getRowKeys(row) {
    return row.id;
}
</script>

<style>
.container {
    display: flex;
    margin-top: 10px;
    align-content: center;
    justify-content: center;

}
</style>