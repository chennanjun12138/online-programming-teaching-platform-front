<template>
    <div>

        <div>
            <el-input v-model="params.questionid" style="width: 200px" placeholder="请输入题号"></el-input>
            <el-input v-model="params.userid" style="width: 200px; margin-left: 5px" placeholder="请输入提交者id"></el-input>

            <el-button type="warning" style="margin-left: 10px" @click="findBySearch()">查询</el-button>
            <el-button type="warning" @click="reset()">清空</el-button>


        </div>
        <div>
            <el-table :data="tableData" style="width: 100%; margin: 15px 0px" ref="table"
                @selection-change="handleSelectionChange" :row-key="getRowKeys">
                <!-- <el-table-column prop="id" label="提交id" width="80px"></el-table-column> -->

                <el-table-column prop="questionid" label="题号" width="60px"></el-table-column>
                <el-table-column prop="language" label="编程语言" width="80px"></el-table-column>
                <el-table-column prop="judgeInfo" label="判题信息"></el-table-column>
                <el-table-column prop="status" label="判题状态" width="80px"></el-table-column>
                <el-table-column prop="userid" label="提交者id" width="80px"></el-table-column>
                <el-table-column prop="createTime" label="提交时间"></el-table-column>
                <el-table-column label="操作">
                    <template #default="{ row }">
                        <el-button slot="reference" type="primary" @click="show(tableData.indexOf(row))">查看</el-button>
                        <el-button type="primary" @click="evaluate(row.id)">评价</el-button>

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
            <el-dialog title="请填写评价" v-model="dialogFormVisible" width="70%">
                <MdEditor :value="mdValue" :handle-change="onMdChange" />
                <div class="container">
                    <el-button type="info" @click="dialogFormVisible = false">取 消</el-button>
                    <el-button type="primary" @click="submit()">确 定</el-button>
                </div>
            </el-dialog>
            <el-dialog title="查看信息" v-model="contentVisible" width="60%">
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
        </div>
    </div>
</template>
    
<script setup  >
import { ref } from 'vue';
import {
    searchcode, deletequestionsubmit, addevaluate, findevaluate
} from "@/api/index.js";
import dayjs from 'dayjs';
import MdEditor from "@/components/MdEditor.vue";
import * as monaco from "monaco-editor";

const mdValue = ref('');
const codemonaco = ref();
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
let total = ref(0);
let tableData = ref([]);
const user = ref(localStorage.getItem("user") ? JSON.parse(localStorage.getItem("user")) : {})
let dialogFormVisible = ref(false);
let contentVisible = ref(false);
let codecontent = ref("");
let form = ref({});
let submitid = ref(0);
let evaluateData = ref([]);
function evaluate(id) {
    dialogFormVisible.value = true;
    submitid.value = id;
}
function show(id) {
     
    contentVisible.value = true;
    codecontent.value = tableData.value[id].code;
    params.value.question_submitid=tableData.value[id].id;
    findevaluate(params.value).then(res => {
        if (res.code === '0') {
            evaluateData.value=res.data;
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
function submit() {
    form.value.question_submitid = submitid.value;
    form.value.teacherid = user.value.id;
    form.value.teachername = user.value.name;
    form.value.content = mdValue.value;
    mdValue.value='';
    console.log( form.value) 
    addevaluate(form.value).then(
        res => {
            if (res.code === '0') {
                window.$message({
                    message: '操作成功',
                    type: 'success'
                });
                dialogFormVisible.value=false;
            }
            else {
                window.$message({
                    message: res.msg,
                    type: 'error'
                });
            }

        }
    )

}
function findBySearch() {
    searchcode(params.value).then(res => {
        if (res.code === '0') {
            tableData.value = res.data.list;
            total.value = res.data.total;
            for (let i = 0; i < total.value; i++) {
                console.log(tableData.value[i].createTime);
                tableData.value[i].createTime = dayjs(tableData.value[i].createTime).format('YYYY-MM-DD HH:mm:ss');
            }
        } else {
            window.$message({
                message: res.msg,
                type: 'error'
            });
        }
    })
}
function del(id) {
    deletequestionsubmit(id).then(res => {
        if (res.code === '0') {
            findBySearch();
        } else {
            window.$message({
                message: res.msg,
                type: 'success'
            });
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
function reset() {
    params.value = {
        pageNum: 1,
        pageSize: 5,
        name: '',
        phone: ''
    }
    findBySearch();
}
</script>
    
<style>
.monaco-editor {
    width: 100%;
    height: 50%;
    margin-top: 5px;
    background-color:black;
}
</style>