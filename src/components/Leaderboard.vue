<template>
    <div>

        <div>
            <el-table :header-cell-style="{ background: '#eef1f6', color: '#606266' }" :data="tableData" stripe
                style="width: 100%; margin: 15px 0px" ref="table" :row-key="getRowKeys">
                <el-table-column prop="name" label="姓名" width="100"></el-table-column>
                <el-table-column prop="sex" label="性别" width="80"></el-table-column>
                <el-table-column prop="age" label="年龄" width="80"></el-table-column>
                <el-table-column prop="phone" label="电话"></el-table-column>
                <el-table-column prop="role" label="角色">
                    <template #default="{ row }">
                        {{ maprol[row.role] }}
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

    </div>
</template>

<script setup>
import { ref } from 'vue';
import { findusers, getallsubmit } from "@/api/index.js";

let params = ref({
    name: '',
    phone: '',
    role: '',
    pageNum: 1,
    pageSize: 5
})
let total = ref(0);
let tableData = ref([]);

const maprol = {
    ROLE_STUDENT: '学生',
    ROLE_TEACHER: '教师'
}
function findBySearch() {
    findusers(params.value).then(res => {
        if (res) {
            tableData.value = res.data.list;
            console.log(tableData);
            total.value = res.data.total;
        }
    })
}
findBySearch();

function handleSizeChange(pageSize) {
    params.value.pageSize = pageSize;
    findBySearch();
}

function handleCurrentChange(pageNum) {
    params.value.pageNum = pageNum;
    findBySearch();
}


function getRowKeys(row) {
    return row.id;
}
</script>

<style></style>