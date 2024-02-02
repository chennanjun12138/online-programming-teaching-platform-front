<template>
    <div>

        <div>
            <el-input v-model="params.name" style="width: 200px" placeholder="请输入题目名"></el-input>
            <el-input v-model="params.creator" style="width: 200px; margin-left: 5px" placeholder="请输入题目创建者"></el-input>

            <el-button type="warning" style="margin-left: 10px" @click="findBySearch()">查询</el-button>
            <el-button type="warning" @click="reset()">清空</el-button>
            <el-button type="primary" style="margin-left: 10px" @click="add()">新增</el-button>

        </div>
        <div>
            <el-table :data="tableData" style="width: 100%; margin: 15px 0px" ref="table"
                @selection-change="handleSelectionChange" :row-key="getRowKeys">
                <el-table-column ref="table" type="selection" width="55" :reserve-selection="true"></el-table-column>
                <el-table-column width="60px" prop="questionid" label="题号"></el-table-column>

                <el-table-column prop="name" label="题目名称"></el-table-column>
                <el-table-column prop="type" label="题目类型"></el-table-column>

                <el-table-column prop="description" label="题目描述"></el-table-column>
                <el-table-column prop="creator" label="创建者" width="80px"></el-table-column>
                <el-table-column prop="createtime" label="创建时间"></el-table-column>
                <el-table-column label="操作">
                    <template #default="{ row }" >
                        <el-button type="primary" @click="edit(row)">编辑</el-button>
                        <el-button slot="reference" type="primary" @click="show(row.questionid)">查看</el-button>
                        <el-popconfirm v-if="row.creator === user.name.toString()" title="确定删除吗？"
                            @confirm="del(row.id, row.questionid)">
                            <template #reference>
                                <el-button type="danger" style="margin-top: 10px;margin-left: 35px">删除</el-button>
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
                    <el-form-item label="题号" label-width="25%">
                        <el-input v-model="form.questionid" autocomplete="off" style="width: 90%"></el-input>
                    </el-form-item>
                    <el-form-item label="题目名" label-width="25%">
                        <el-input v-model="form.name" autocomplete="off" style="width: 90%"></el-input>
                    </el-form-item>
                    <el-form-item label="题目类型" label-width="25%">
                        <el-input v-model="form.type" autocomplete="off" style="width: 90%"></el-input>
                    </el-form-item>
                    <el-form-item label="题目创建者" label-width="25%">
                        <el-input v-model="form.creator"  readonly autocomplete="off" style="width: 90%"></el-input>
                    </el-form-item>
                    <el-form-item label="题目描述" label-width="25%">
                        <el-input v-model="form.description" autocomplete="off" style="width: 90%"></el-input>
                    </el-form-item>
                    <el-form-item label="所属作业" label-width="25%">
                        <el-input v-model="form.belongid" autocomplete="off" style="width: 90%"></el-input>
                    </el-form-item>
                    <span class="centered-text">请输入作业号，形式如[1,2],若无所属作业输入[]</span>
                </el-form>
                <div class="container">
                    <el-button type="info" @click="dialogFormVisible = false">取 消</el-button>
                    <el-button type="primary" @click="submit()">确 定</el-button>
                </div>
            </el-dialog>
            <el-dialog title="题目内容" v-model="contentVisible" width="50%">
                <el-form :model="form" class="multiline-text">

                    <el-form-item label="题目描述" label-width="25%">
                        <el-input v-model="form.content" autocomplete="off" style="width: 90%" type="textarea"></el-input>
                    </el-form-item>
                    <el-form-item label="题目条件" label-width="25%">
                        <el-input v-model="form.tiaojian" autocomplete="off" style="width: 90%"></el-input>
                    </el-form-item>
                    <el-form-item label="输入要求" label-width="25%">
                        <el-input v-model="form.input" autocomplete="off" style="width: 90%" type="textarea"></el-input>
                    </el-form-item>
                    <el-form-item label="输出要求" label-width="25%">
                        <el-input v-model="form.output" autocomplete="off" style="width: 90%" type="textarea"></el-input>
                    </el-form-item>
                    <el-form-item label="输入样例" label-width="25%">
                        <el-input v-model="form.examplein" autocomplete="off" style="width: 90%" type="textarea"></el-input>
                    </el-form-item>
                    <el-form-item label="输出样例" label-width="25%">
                        <el-input v-model="form.exampleout" autocomplete="off" style="width: 90%"
                            type="textarea"></el-input>
                    </el-form-item>
                </el-form>
                <div class="container">
                    <el-button type="info" @click="contentVisible = false">取 消</el-button>
                    <el-button type="primary" @click="savecontent()">确 定</el-button>
                </div>
            </el-dialog>
        </div>
    </div>
</template>
    
<script setup  >
import { ref } from 'vue';
import {
    addquestion,
    changequestion,
    changequestionbank, delBatchquestion,
    delBatchquestionbank,
    deletequestion,
    deletequestionbank,
    findquestion,
    findquestionbanks
} from "@/api/index.js";

let params = ref({
    name: '',
    phone: '',
    author: '',
    pageNum: 1,
    pageSize: 5
})
let total = ref(0);
let tableData = ref([]);
let dialogFormVisible = ref(false);
let contentVisible = ref(false);

let multipleSelection = ref([]);
let selectedquestionid = ref([]);
let form = ref({})
let list = ref({})
const user = ref(localStorage.getItem("user") ? JSON.parse(localStorage.getItem("user")) : {})
function findBySearch() {
    findquestionbanks(params.value).then(res => {
        if (res.code === '0') {
            tableData.value = res.data.list;
            total.value = res.data.total;
        } else {
            window.$message({
                message: res.msg,
                type: 'error'
            });
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
    form.value = {
        creator: user.value.name,
        belongid: '[]'
    };
    dialogFormVisible.value = true;
}
function edit(obj) {
    form.value = obj;
    dialogFormVisible.value = true;
}
function show(id) {
    form.value = {}
    params.value.questionid = id;
    findquestion(params.value).then(res => {
        if (res.code === '0') {
            form.value = res.data;
            contentVisible.value = true;
        } else {
            window.$message({
                message: res.msg,
                type: 'error'
            });
        }
    })
}
function submit() {
    changequestionbank(form.value).then(res => {
        if (res.code === '0') {

            dialogFormVisible.value = false;
            findBySearch();
        } else {
            window.$message({
                message: res.msg,
                type: 'success'
            });
        }
    })
    list.value = {}
    list.value.id = form.value.questionid;
    if (form.value.id === undefined) {
        addquestion(list.value).then(
            res => {
                if (res.code === '0') {
                    window.$message({
                        message: '操作成功',
                        type: 'success'
                    });
                }
                else {
                    window.$message({
                        message: res.msg,
                        type: 'success'
                    });
                }

            }
        )
    }

}
function savecontent() {
    changequestion(form.value).then(res => {
        if (res.code === '0') {
            window.$message({
                message: '操作成功',
                type: 'success'
            });
            contentVisible.value = false;

        } else {
            window.$message({
                message: res.msg,
                type: 'success'
            });
        }
    })
}
function del(id, questionid) {
    deletequestionbank(id).then(res => {
        if (res.code === '0') {
            findBySearch();
        } else {
            window.$message({
                message: res.msg,
                type: 'success'
            });
        }
    })
    deletequestion(questionid).then(res => {
        if (res.code === '0') {
            window.$message({
                message: '删除成功',
                type: 'success'
            });

        } else {
            window.$message({
                message: res.msg,
                type: 'success'
            });
        }
    })
}
function successUpload(res) {
    form.value.img = res.data;

}
function down(flag) {
    location.href = 'http://localhost:8080/api/files/' + flag
}
function handleSelectionChange(val) {
    multipleSelection.value = val;
    selectedquestionid.value = [];
    for (let i = 0; i < val.length; i++) {
        console.log(val[i].questionid);
        params.value.questionid = val[i].questionid;
        //  console.log(params.value.questionid);
        findquestion(params.value).then(res => {
            if (res.code === '0') {
                selectedquestionid.value.push(res.data);
            } else {
                window.$message({
                    message: res.msg,
                    type: 'error'
                });
            }
        })
    }
}
function delBatch() {
    if (multipleSelection.value.length === 0) {
        window.$message.warning("请勾选您要删除的项")
        return
    }
    console.log(multipleSelection.value);
    console.log('questionid');
    console.log(selectedquestionid.value);
    delBatchquestionbank(multipleSelection.value).then(res => {
        if (res.code === '0') {
            window.$message.success("批量删除成功")
            findBySearch()
        } else {
            window.$message.error(res.msg)
        }
    })
    delBatchquestion(selectedquestionid.value).then(res => {
        if (res.code === '0') {
            window.$message.success("批量删除成功")

        } else {
            window.$message.error(res.msg)
        }
    })
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

.button-container {
    display: flex;
    gap: 10px;
    /* 设置按钮之间的间距 */
}

.multiline-text {
    white-space: pre-line;
}
</style>