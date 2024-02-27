<template>
    <div>

        <div>
            <el-input v-model="params.questionid" style="width: 200px" placeholder="请输入题号"></el-input>

            <el-select v-model="params.language" clearable placeholder="请选择编程语言" style="margin-left: 5px; width: 200px;">
                <el-option v-for="item in options" :key="item.value" :label="item.label" :value="item.value">
                </el-option>
            </el-select>
            <el-select v-model="params.runresult" clearable placeholder="请输入代码结果" style="margin-left: 5px; width: 200px;">
                <el-option v-for="item in resultoptions" :key="item.value" :label="item.label" :value="item.value">
                </el-option>
            </el-select>
            <el-button type="warning" style="margin-left: 10px" @click="findBySearch()">查询</el-button>
            <el-button type="warning" style="margin-left: 10px" @click="showchart()">查看情况</el-button>
            <el-button type="warning" @click="reset()">清空</el-button>


        </div>
        <div>
            <el-table :data="tableData" style="width: 100%; margin: 15px 0px" ref="table"
                @selection-change="handleSelectionChange" :row-key="getRowKeys">
                <el-table-column prop="questionid" label="题号" width="60px"></el-table-column>
                <el-table-column prop="language" label="编程语言" width="80px"></el-table-column>
                <el-table-column prop="judgeInfo" label="判题信息"></el-table-column>
                <el-table-column prop="status" label="判题状态" width="80px"></el-table-column>
                <el-table-column prop="username" label="提交者" width="80px"></el-table-column>

                <el-table-column prop="createTime" label="提交时间"></el-table-column>
                <el-table-column label="操作">
                    <template #default="{ row }">
                        <el-button type="primary" @click="show(tableData.indexOf(row))">查看评价</el-button>

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
            <el-dialog title="请查看评价" v-model="dialogFormVisible" width="70%">
                <div class='monaco-editor'>
                    <pre style="white-space: pre-wrap;">
                        {{ codecontent }}
                    </pre>
                </div>
                <el-table :data="evaluateData" style="width: 100%; margin: 15px 0px" ref="table"
                    @selection-change="handleSelectionChange" :row-key="getRowKeys">
                    <el-table-column prop="content" label="评价内容"></el-table-column>
                    <el-table-column prop="teachername" label="评价者" width="80px"></el-table-column>
                </el-table>
            </el-dialog>
            <el-dialog class="chartflex" style="width: 90%;" v-model="contentVisible">
                <Chart :QuestionData="questiondata" :SubmitData="submitdata" />
            </el-dialog>
        </div>
    </div>
</template>
  
<script setup  >
import { ref } from 'vue';
import {
    searchcode, findevaluate, findByid, getallsubmit, findbyquestionid
} from "@/api/index.js";
import dayjs from 'dayjs';

import Chart from '@/components/Chart.vue';

const mdValue = ref('');
const onMdChange = (v) => {
    mdValue.value = v;
};
let params = ref({
    name: '',
    phone: '',
    author: '',
    pageNum: 1,
    pageSize: 5,
})
let total = ref(0);
let tableData = ref([]);
let resultoptions = ref([
    {
        value: 'Accepted',
        label: 'Accepted',
    },
    {
        value: 'Wrong Answer',
        label: 'Wrong Answer',
    },

    {
        value: '内存溢出',
        label: '内存溢出',
    },
    {
        value: '超时',
        label: '超时',
    },
    {
        value: '编译错误',
        label: '编译错误',
    },

])
let questiondata = ref([
    { value: 0, name: '算法设计与分析' },
    { value: 0, name: '数据结构' },
    { value: 0, name: '字符串处理' },
    { value: 0, name: '数学问题' },
    { value: 0, name: '模拟题' },
    { value: 0, name: '计算几何' },
    { value: 0, name: '动态规划' },
    { value: 0, name: '图论' },
])
let submitdata = ref([
    {
        name: 'Accepted',
        value: 0
    },
    {
        name: 'Wrong Answer',
        value: 0
    },

    {
        name: '内存溢出',
        value: 0
    },
    {
        name: '超时',
        value: 0
    },
    {
        name: '编译错误',
        value: 0
    },

])

const user = ref(localStorage.getItem("user") ? JSON.parse(localStorage.getItem("user")) : {})
let dialogFormVisible = ref(false);
let contentVisible = ref(false);
let options = ref([
    {
        value: 'java',
        label: 'Java'
    },
    {
        value: 'c',
        label: 'C'
    },
    {
        value: 'javascript',
        label: 'Javascript'
    },
    {
        value: 'sql',
        label: 'Sql'
    },
    {
        value: 'python',
        label: 'Python'
    },
])
let evaluateData = ref([]);
let codecontent = ref("");
function showchart() {
    contentVisible.value = true;
}
function show(id) {
    dialogFormVisible.value = true;
    codecontent.value = tableData.value[id].code;
    params.value.question_submitid = tableData.value[id].id;
    findevaluate(params.value).then(res => {
        if (res.code === '0') {
            evaluateData.value = res.data;
            console.log(res.data);
            console.log(evaluateData.value);
        }
        else {
            window.$message({
                message: res.msg,
                type: 'error'
            });
        }
    })
}
findBySearch();
function findBySearch() {
    params.value.userid = user.value.id;
    searchcode(params.value).then(res => {
        if (res.code === '0') {
            tableData.value = res.data.list;
            total.value = res.data.total;
            for (let i = 0; i < total.value; i++) {
                tableData.value[i].username = user.value.name;
                tableData.value[i].status = display(tableData.value[i].status);
                tableData.value[i].createTime = dayjs(tableData.value[i].createTime).format('YYYY-MM-DD HH:mm:ss');


            }

        } else {
            window.$message({
                message: res.msg,
                type: 'error'
            });
        }
    })
    getallsubmit(params.value).then(res => {
        if (res.code === '0') {
            let questions = ref([]);
            for (let i = 0; i < res.data.length; i++) {
                const jsonData = JSON.parse(res.data[i].judgeInfo);
                submitdata.value.forEach(item => {
                    if (item.name === jsonData.message) {
                        item.value++;
                    }
                });
                params.value.questionid = res.data[i].questionid;

                if (!questions.value.includes(res.data[i].questionid)) {
                    findbyquestionid(params.value).then(
                        res => {
                            if (res.code === '0') {

                                questiondata.value.forEach(item => {
                                    if (item.name === res.data[0].type) {
                                        item.value++;
                                    }
                                });
                            }
                        }
                    )
                    questions.value.push(res.data[i].questionid)
                }


            }
            params.value.questionid = ''
        }
    })

}

function display(status) {
    if (status === 0) {
        return "等待中";
    }
    else if (status === 1) {
        return "判题中";
    }
    else if (status === 2) {
        return "判题成功";
    }
    else if (status === 3) {
        return "判题失败";
    }
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

</script>
  
<style>
.chartflex {
    display: flex;
    justify-content: center;

    height: 520px;
}
</style>