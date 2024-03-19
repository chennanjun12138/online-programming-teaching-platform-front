<template>
    <div>

        <div>
            <el-input v-model="params.questionid" style="width: 100px" placeholder="请输入题号"></el-input>
            <el-input v-model="params.name" style="width: 150px; margin-left: 5px" placeholder="请输入提交者"></el-input>
            <el-select v-model="params.language" clearable placeholder="请选择编程语言"
                style="margin-left: 5px; width: 150px;">
                <el-option v-for="item in options" :key="item.value" :label="item.label" :value="item.value">
                </el-option>
            </el-select>
            <el-select v-model="params.runresult" clearable placeholder="请输入代码结果"
                style="margin-left: 5px; width: 150px;">
                <el-option v-for="item in resultoptions" :key="item.value" :label="item.label" :value="item.value">
                </el-option>
            </el-select>
            <el-button type="primary" style="margin-left: 10px" @click="findBySearch()" :icon="Search">查询</el-button>
            <el-button type="primary" style="margin-left: 10px" @click="showchart()" :icon="Search">查看情况</el-button>
            <el-button type="warning" @click="reset()">清空</el-button>
            <el-checkbox v-model="checked1" label="只查看自己提交" size="default" @change="handleCheckboxChange"
                style="margin-left: 15px; margin-top: 10px;" />

        </div>
        <div>
            <el-table :header-cell-style="{ textAlign: 'center', background: '#eef1f6', color: '#606266' }"
                :data="tableData" style="width: 100%; margin: 15px 0px" ref="table"
                @selection-change="handleSelectionChange" :row-key="getRowKeys" :cell-style="{ textAlign: 'center' }">
                <el-table-column prop="questionid" label="题号" width="70px">
                    <template #default="{ row }">
                        <el-button type="primary" @click="gotoquestion(row.questionid)" text>{{ row.questionid }}
                        </el-button>
                    </template>
                </el-table-column>
                <el-table-column prop="language" label="编程语言" width="80px"></el-table-column>
                <el-table-column prop="judgeInfo" label="判题结果" width="140px">
                    <template #default="{ row }">
                        <el-tag size="large" v-if="row.judgeInfo.message == 'Accepted'" type="success">
                            {{ row.judgeInfo.message }}</el-tag>
                        <el-tag size="large" v-else type="error"> {{ row.judgeInfo.message }}</el-tag>
                    </template>
                </el-table-column>
                <el-table-column prop="judgeInfo" label="判题信息" width="150px">
                    <template #default="{ row }">
                        <span>{{ row.judgeInfo.memory }}KB/{{ row.judgeInfo.time }}ms</span>
                    </template>
                </el-table-column>
                <el-table-column prop="status" label="判题状态" width="80px"></el-table-column>
                <el-table-column prop="username" label="提交者" width="80px"></el-table-column>

                <el-table-column prop="createTime" label="提交时间"></el-table-column>
                <el-table-column label="操作">
                    <template #default="{ row }">
                        <el-button type="primary" @click="show(tableData.indexOf(row))" :icon="Search">查看评价</el-button>

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
                <div class='monaco-editor' style="border: 1px solid #ccc; padding: 10px;">
                    <pre style="white-space: pre-wrap;">
                {{ codecontent }}
            </pre>
                </div>
                <el-table :header-cell-style="{ textAlign: 'center', background: '#eef1f6', color: '#606266' }"
                    :data="evaluateData" style="width: 100%; margin: 15px 0px" ref="table"
                    @selection-change="handleSelectionChange" :row-key="getRowKeys"
                    :cell-style="{ textAlign: 'center' }">
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

<script setup>
import { ref } from 'vue';
import {
    searchcode, findevaluate, getallsubmit, findbyquestionid
} from "@/api/index.js";
import dayjs from 'dayjs';
import { Search } from '@element-plus/icons-vue'
import Chart from '@/components/Chart.vue';
import { useRouter } from "vue-router";
const router = useRouter()
let checked1 = ref(false)
let params = ref({
    name: '',
    phone: '',
    author: '',
    pageNum: 1,
    pageSize: 5,
})
let params2 = ref({
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
let hasExecuted = false;
function handleCheckboxChange()
{
    if (checked1.value == true) {
        params.value.userid = user.value.id;
        findBySearch()
    }
    else 
    {
        params.value.userid=null;
        findBySearch()
    }
}
function showchart() {
    contentVisible.value = true;
}
function gotoquestion(questionid) {
    router.push(`/questioncontent/${questionid}`)
}
function show(id) {
    dialogFormVisible.value = true;
    codecontent.value = tableData.value[id].code;
    params.value.question_submitid = tableData.value[id].id;
    findevaluate(params.value).then(res => {
        if (res) {
            evaluateData.value = res.data;
            console.log(res.data);
            console.log(evaluateData.value);
        }

    })
}
findBySearch();
function findBySearch() {
    // params.value.userid = user.value.id;
    const queryString = window.location.search;
    // 创建 URLSearchParams 对象并获取参数值
    const urlParams = new URLSearchParams(queryString);
    const questionId = urlParams.get('param');
    const runresult = urlParams.get('param2');
    if (questionId != null) {
        params.value.questionid = questionId;
    }
    if (runresult != null) {
        params.value.runresult = runresult;
    }

    searchcode(params.value).then(res => {
        if (res) {
            tableData.value = res.data.list;
            total.value = res.data.total;
            for (let i = 0; i < total.value; i++) {
                tableData.value[i].username = user.value.name;
                tableData.value[i].judgeInfo = JSON.parse(tableData.value[i].judgeInfo);
                tableData.value[i].status = display(tableData.value[i].status);
                tableData.value[i].createTime = dayjs(tableData.value[i].createTime).format('YYYY-MM-DD HH:mm:ss');

            }
        }
    })



    // 执行 getcodestatus() 函数，并在执行后将标志变量设置为 true
    if (!hasExecuted) {
        getcodestatus();
        hasExecuted = true;
    }
}
function getcodestatus() {
    params2.value = params.value;
    getallsubmit(params2.value).then(res => {
        if (res) {
            let questions = ref([]);
            for (let i = 0; i < res.data.length; i++) {
                const jsonData = JSON.parse(res.data[i].judgeInfo);
                submitdata.value.forEach(item => {
                    if (item.name === jsonData.message) {
                        item.value++;
                    }
                });
                params2.value.questionid = res.data[i].questionid;

                if (!questions.value.includes(res.data[i].questionid)) {
                    findbyquestionid(params2.value).then(
                        res => {
                            if (res) {

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
            params2.value.questionid = ''
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
    // 获取当前页面的 URL
    const currentUrl = window.location.href;

    // 去掉 ? 后面的内容
    const updatedUrl = currentUrl.split('?')[0];
    history.pushState({}, '', updatedUrl);
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



a {
    text-decoration: none;
    /* 去掉下划线 */
    color: rgb(58, 178, 242);
    /* 设置颜色为蓝色 */
}

a:visited {
    color: rgb(58, 178, 242);
    /* 设置已访问链接的颜色为蓝色 */
}

.monaco-editor {
    width: 100%;
    height: 50%;
    margin-top: 5px;
    background-color: rgb(250, 248, 248);
}
</style>