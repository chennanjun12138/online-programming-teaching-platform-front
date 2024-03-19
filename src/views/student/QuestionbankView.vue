<template>
    <div>

        <div>
            <el-input v-model="params.name" style="width: 200px" placeholder="请输入题目名"></el-input>
            <el-input v-model="params.creator" style="width: 200px; margin-left: 5px" placeholder="请输入题目创建者"></el-input>
            <el-select v-model="params.type" clearable placeholder="请选择题目类型" style="margin-left: 5px; width: 200px;">
                <el-option v-for="item in options" :key="item.value" :label="item.label" :value="item.value">
                </el-option>
            </el-select>
            <el-button type="primary" style="margin-left: 10px" @click="findBySearch()" :icon="Search">查询</el-button>
            <el-button type="warning" @click="reset()">清空</el-button>

        </div>
        <div>
            <el-table :header-cell-style="{textAlign: 'center', background: '#eef1f6', color: '#606266' }" :data="tableData"
                style="width: 100%; margin: 15px 0px" ref="table" @selection-change="handleSelectionChange"
                :row-key="getRowKeys" :cell-style="{ textAlign: 'center' }">
                <el-table-column  prop="questionid" label="题号" width="60px"></el-table-column>

                <el-table-column prop="name" label="题目名称"></el-table-column>
                <el-table-column prop="type" label="题目类型"></el-table-column>

                <el-table-column prop="description" label="题目描述"></el-table-column>
                <el-table-column prop="creator" label="创建者" width="80px"></el-table-column>
                <el-table-column label="通过率(解决/提交)">

                    <template #default="{ row }">
                        <span v-if="row.submitnum != 0">{{ (row.solvenum / row.submitnum * 100).toFixed(1) }}%(<a
                                :href="'http://localhost:7100/code?param=' + row.questionid+'&param2=Accepted'">{{ row.solvenum }}</a>/<a
                                :href="'http://localhost:7100/code?param=' + row.questionid">{{ row.submitnum
                                }}</a>)</span>
                        <span v-else>0.0%</span>
                    </template>
                </el-table-column>
                <el-table-column prop="createtime" label="创建时间"></el-table-column>
                <el-table-column label="操作">
                    <template #default="{ row }">
                        <el-button type="primary" @click="gotoquestion(row.questionid)" :icon="EditPen">练习</el-button>

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
import { findquestionbanks } from "@/api/index.js";
import { useRouter } from "vue-router";
import { Search, EditPen } from '@element-plus/icons-vue'

const router = useRouter()
let params = ref({
    name: '',
    phone: '',
    author: '',
    pageNum: 1,
    pageSize: 5
})
let total = ref(0);
let tableData = ref([]);
let multipleSelection = ref([]);
let options = ref([
    {
        value: '算法设计与分析',
        label: '算法设计与分析'
    },
    {
        value: '数据结构',
        label: '数据结构'
    },
    {
        value: '数学问题',
        label: '数学问题'
    },
    {
        value: '字符串处理',
        label: '字符串处理'
    },
    {
        value: '计算几何',
        label: '计算几何'
    },
    {
        value: '模拟题',
        label: '模拟题'
    },
    {
        value: '图论',
        label: '图论'
    },
    {
        value: '动态规划',
        label: '动态规划'
    },
]

)
function gotoquestion(questionid) {
    router.push(`/questioncontent/${questionid}`)
}
function findBySearch() {
    findquestionbanks(params.value).then(res => {
        if (res) {
            tableData.value = res.data.list;
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

function handleSelectionChange(val) {
    multipleSelection.value = val;
}

function getRowKeys(row) {
    return row.id;
}

</script>

<style scoped></style>