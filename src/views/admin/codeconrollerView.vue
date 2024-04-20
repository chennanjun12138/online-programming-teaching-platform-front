<template>
    <div>

        <div>
            <el-input v-model="params.questionid" style="width: 200px" placeholder="请输入题号"></el-input>
            <el-input v-model="params.name" style="width: 200px; margin-left: 5px" placeholder="请输入提交者"></el-input>

            <el-select v-model="params.runresult" clearable placeholder="请输入代码结果"
                style="margin-left: 5px; width: 200px;">
                <el-option v-for="item in resultoptions" :key="item.value" :label="item.label" :value="item.value">
                </el-option>
            </el-select>
            <el-select v-model="params.language" clearable placeholder="请选择编程语言"
                style="margin-left: 5px; width: 200px;">
                <el-option v-for="item in options" :key="item.value" :label="item.label" :value="item.value">
                </el-option>
            </el-select>
            <el-button type="primary" style="margin-left: 10px" @click="findBySearch()" :icon="Search">查询</el-button>
            <el-button type="warning" @click="reset()">清空</el-button>


        </div>
        <div>
            <el-table :header-cell-style="{textAlign: 'center', background: '#eef1f6', color: '#606266' }" :data="tableData"
                style="width: 100%; margin: 15px 0px" ref="table" :cell-style="{ textAlign: 'center' }" 
                :row-key="getRowKeys" >

                <el-table-column prop="questionid" label="题号" width="55px">
                    <template #default="{ row }">
                        <el-button style="width: 60%;" type="primary" @click="gotoquestion(row.questionid)" text>{{
                row.questionid }}
                        </el-button>
                    </template>
                </el-table-column>
                <el-table-column prop="language" label="编程语言" width="80px"></el-table-column>
                <el-table-column prop="judgeInfo" label="判题结果" width="135px">
                    <template #default="{ row }">
                        <el-tag size="large" v-if="row.judgeInfo.message == 'Accepted'" type="success">
                            {{ row.judgeInfo.message }}</el-tag>
                        <el-tag size="large" v-else type="error"> {{ row.judgeInfo.message }}</el-tag>
                    </template>
                </el-table-column>
                <el-table-column prop="judgeInfo" label="判题信息" width="135px">
                    <template #default="{ row }">
                        <span>{{ row.judgeInfo.memory }}KB/{{ row.judgeInfo.time }}ms</span>
                    </template>
                </el-table-column> <el-table-column prop="status" label="判题状态" width="80px"></el-table-column>
                <el-table-column prop="userid" label="提交者" width="80px"></el-table-column>
                <el-table-column prop="createTime" label="提交时间" width="165px"></el-table-column>
                <el-table-column label="操作">
                    <template #default="{ row }">
                        <el-button slot="reference" type="primary" @click="show(tableData.indexOf(row))"
                            :icon="Search">查看</el-button>
                        <el-button type="primary" @click="evaluate(row.id)" :icon="EditPen">评价</el-button>

                        <el-popconfirm title="确定删除吗" @confirm="del(row.id)">
                            <template #reference>
                                <el-button type="danger" style="margin-left: 5px" :icon="Delete">删除</el-button>
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
            <el-dialog title="请填写评价" v-model="dialogFormVisible" width="70%">
                <MdEditor :value="mdValue" :handle-change="onMdChange" />
                <div class="container">
                    <el-button type="info" @click="dialogFormVisible = false">取 消</el-button>
                    <el-button type="primary" @click="submit()">确 定</el-button>
                </div>
            </el-dialog>
            <el-dialog title="查看信息" v-model="contentVisible" width="60%">
                <div class='monaco-editor' style=" overflow: auto;">
                    <pre style="white-space: pre-wrap;">
                {{ codecontent }}
            </pre>
                </div>
                <el-table :header-cell-style="{ background: '#eef1f6', color: '#606266' }" :data="evaluateData"
                    style="width: 100%; margin: 15px 0px" ref="table" @selection-change="handleSelectionChange"
                    :row-key="getRowKeys">
                    <el-table-column prop="content" label="评价内容"></el-table-column>
                    <el-table-column prop="teachername" label="评价者" width="80px"></el-table-column>
                </el-table>
            </el-dialog>
        </div>
    </div>
</template>

<script setup>
import { ref } from 'vue';
import {
    searchcode, deletequestionsubmit, addevaluate, findevaluate, findByid
} from "@/api/index.js";
import dayjs from 'dayjs';
import MdEditor from "@/components/MdEditor.vue";
import { Search, Delete, EditPen } from '@element-plus/icons-vue'
import { useRouter } from "vue-router";
const router = useRouter()

const mdValue = ref('');
const onMdChange = (v) => {
    mdValue.value = v;
};
let params = ref({
    name: '',
    phone: '',
    author: '',
    pageNum: 1,
    pageSize: 5
})
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
let total = ref(0);
let tableData = ref([]);
const user = ref(localStorage.getItem("user") ? JSON.parse(localStorage.getItem("user")) : {})
let dialogFormVisible = ref(false);
let contentVisible = ref(false);
let codecontent = ref("");
let form = ref({});
let submitid = ref(0);
let evaluateData = ref([]);
function gotoquestion(questionid) {
    router.push(`/questioncontent/${questionid}`)
}
function evaluate(id) {
    dialogFormVisible.value = true;
    submitid.value = id;
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
function show(id) {

    contentVisible.value = true;
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
function submit() {
    form.value.question_submitid = submitid.value;
    form.value.teacherid = user.value.id;
    form.value.teachername = user.value.name;
    form.value.content = mdValue.value;
    mdValue.value = '';
    console.log(form.value)
    addevaluate(form.value).then(
        res => {
            if (res) {
                window.$message({
                    message: '操作成功',
                    type: 'success'
                });
                dialogFormVisible.value = false;
            }

        }
    )

}
findBySearch();
function findBySearch() {
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
            console.log(res.data.list);
            tableData.value = res.data.list;
            total.value = res.data.total;
            for (let i = 0; i < total.value; i++) {
                getname(tableData.value[i].userid, i)
                tableData.value[i].judgeInfo = JSON.parse(tableData.value[i].judgeInfo);
                tableData.value[i].status = display(tableData.value[i].status);
                tableData.value[i].createTime = dayjs(tableData.value[i].createTime).format('YYYY-MM-DD HH:mm:ss');
            }
        }
    })
}
function getname(id, i) {
    findByid(id).then(res => {
        if (res) {
            tableData.value[i].userid = res.data.name + "\n" + "(id:" + id + ")";
        }
    })

}
function del(id) {
    deletequestionsubmit(id).then(res => {
        if (res) {
            findBySearch();
        }
    })

}

function handleSizeChange(pageSize) {
    params.value.pageSize = pageSize;
    findBySearch();
}
function handleCurrentChange(pageNum) {
    params.value.pageNum = pageNum;
    findBySearch();
}
function reset() {
    params.value = {
        pageNum: 1,
        pageSize: 5,
        questionid: '',
        runresult: '',
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
</script>

<style>
.monaco-editor {
    width: 100%;
    height: 50%;
    margin-top: 5px;
    background-color: black;
}
</style>