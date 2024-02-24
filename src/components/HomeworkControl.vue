<template>
    <div>
        <div>
            <el-input v-if="tableVisible" v-model="params.name" style="width: 200px" placeholder="请输入作业名"></el-input>
            <el-input v-if="tableVisible&&props.msg!='B'" v-model="params.teacher" style="width: 200px; margin-left: 5px"
                placeholder="请输入作业教师"></el-input>
            <el-button v-if="tableVisible" type="warning" style="margin-left: 10px" @click="findBySearch()">查询</el-button>
            <el-button v-if="tableVisible2" type="warning" style="margin-left: 10px" @click="findBySearch()">返回</el-button>
            <span v-if="tableVisible2" style="margin-left: 20px">作业说明：{{ notice }}</span>

            <el-button v-if="tableVisible" type="warning" @click="reset()">清空</el-button>
            <el-button v-if="tableVisible" type="primary" style="margin-left: 10px" @click="add()">新增</el-button>
            <el-popconfirm v-if="tableVisible" title="确定删除这些数据吗？" @confirm="delBatch()">
                <template #reference>
                    <el-button type="danger" style="margin-left: 5px">批量删除</el-button>
                </template>
            </el-popconfirm>

        </div>
        <div>
            <el-table :data="tableData" v-if="tableVisible" style="width: 100%; margin: 15px 0px" ref="table"
                @selection-change="handleSelectionChange" :row-key="getRowKeys">
                <el-table-column ref="table" type="selection" width="55" :reserve-selection="true"></el-table-column>
                <el-table-column width="70px" prop="homeworkid" label="作业号"></el-table-column>
                <el-table-column prop="name" label="作业名"></el-table-column>
                <el-table-column prop="teacher" label="作业教师"></el-table-column>
                <el-table-column prop="starttime" label="开始时间" width="120px"></el-table-column>
                <el-table-column prop="endtime" label="结束时间" width="120px"></el-table-column>
                <el-table-column label="操作">
                    <template #default="{ row }">
                        <el-button type="primary" @click="edit(row)">编辑</el-button>
                        <el-button type="primary"
                            @click="searchbyhomework(tableData.indexOf(row), row.content, row.illustrate, row.homeworkid)">查看</el-button>
                        <el-popconfirm title="确定删除吗？" @confirm="del(row.homeworkid)">
                            <template #reference>
                                <el-button type="danger" style="margin-left: 5px">删除</el-button>
                            </template>
                        </el-popconfirm>
                    </template>
                </el-table-column>
            </el-table>
            <el-table v-if="tableVisible2" :data="questiondata" style="width: 100%; margin: 15px 0px" ref="table"
                @selection-change="handleSelectionChange" :row-key="getRowKeys">
                <el-table-column ref="table" type="selection" width="55" :reserve-selection="true"></el-table-column>
                <el-table-column width="60px" prop="questionid" label="题号"></el-table-column>

                <el-table-column prop="name" label="题目名称"></el-table-column>
                <el-table-column prop="type" label="题目类型"></el-table-column>

                <el-table-column prop="description" label="题目描述"></el-table-column>
                <el-table-column prop="creator" label="创建者" width="80px"></el-table-column>
                <el-table-column prop="createtime" label="创建时间"></el-table-column>
                <el-table-column label="操作">
                    <template #default="{ row }">
                        <el-popconfirm title="确定删除吗？" @confirm="delcontent(questiondata.indexOf(row), row.questionid)">
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

                    <el-form-item label="作业名" label-width="25%">
                        <el-input v-model="form.name" autocomplete="off" style="width: 90%"></el-input>
                    </el-form-item>
                    <el-form-item label="作业教师" label-width="25%">
                        <el-input v-model="form.teacher" autocomplete="off" style="width: 90%"></el-input>
                    </el-form-item>
                    <el-form-item label="开始时间" label-width="25%">
                        <el-date-picker v-model="form.starttime" type="date" placeholder="选择日期">
                        </el-date-picker>
                    </el-form-item>
                    <el-form-item label="结束时间" label-width="25%">
                        <el-date-picker v-model="form.endtime" type="date" placeholder="选择日期">
                        </el-date-picker>
                    </el-form-item>
                    <el-form-item label="作业说明" label-width="25%">
                        <el-input type="textarea" v-model="form.illustrate" autocomplete="off"
                            style="width: 90%"></el-input>
                    </el-form-item>
                    <el-form-item label="作业内容" label-width="25%">
                        <el-input v-model="form.content" autocomplete="off" style="width: 90%"></el-input>
                    </el-form-item>
                    <span class="centered-text">请输入题号，形式如[1,2]</span>
                </el-form>
                <div class="container">
                    <el-button type="info" @click="dialogFormVisible = false">取 消</el-button>
                    <el-button type="primary" @click="submit()">确 定</el-button>
                </div>
            </el-dialog>
        </div>
    </div>
</template>
    
<script setup >
import { ref } from 'vue';
const props = defineProps({
    msg: String,
})
import { changehomework, delBatchhomework, deletehomework, findbyhomework, findhomeworks, updatehomework, updatequestionbank } from "@/api/index.js";
let params = ref({
    name: '',
    phone: '',
    author: '',
    pageNum: 1,
    pageSize: 5,
    content: '',
})
let total = ref(0);
let tableData = ref([]);
let questiondata = ref([]);
let tableVisible = ref(true);
let tableVisible2 = ref(false);
let multipleSelection = ref([]);
let dialogFormVisible = ref(false);
let form = ref({})
let workid = ref(0);
let notice = ref('');
let zuoyeid = ref('')
const user = ref(localStorage.getItem("user") ? JSON.parse(localStorage.getItem("user")) : {})

function delcontent(listid, questionid) {
    let str = tableData.value[workid.value].content;
    let arr = JSON.parse(str);
    //  console.log(listid)
    //   console.log(arr)
    arr.splice(listid, 1);
    let newStr = JSON.stringify(arr);
    console.log(newStr); // 输出 '[1,3]'
    tableData.value[workid.value].content = newStr;
    form.value = tableData.value[workid.value];
    updatehomework(form.value).then(res => {
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
    form.value = {}
    form.value.questionid = questionid;
    form.value.homeworkid = zuoyeid.value;
    updatequestionbank(form.value).then(
        res => {
            if (res.code === '0') {
                this.$message({
                    message: '修改成功',
                    type: 'success'
                });

            } else {
                this.$message({
                    message: res.msg,
                    type: 'success'
                });
            }
        }
    )
}
function findBySearch() {
    if (props.msg === 'B') {
        params.value.teacher = user.value.name;
    }
    findhomeworks(params.value).then(res => {
        if (res.code === '0') {

            tableData.value = res.data.list;
            total.value = res.data.total;

            tableVisible.value = true;
            tableVisible2.value = false;
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
function searchbyhomework(id, content, illustrate, homeworkid) {
    console.log(id);

    workid.value = id;
    console.log(workid.value);
    notice.value = illustrate;
    zuoyeid.value = homeworkid;


    params.value.content = content.substring(1, content.length - 1);
    findbyhomework(params.value).then(res => {
        if (res.code === '0') {
            questiondata.value = res.data.list;
            total.value = res.data.total;

            tableVisible.value = false;
            tableVisible2.value = true;
        } else {
            window.$message({
                message: res.msg,
                type: 'error'
            });
        }
    })
}
function add() {
    form.value = { content: '[]' };
    dialogFormVisible.value = true;
}
function edit(obj) {
    form.value = obj;
    dialogFormVisible.value = true;
}
function submit() {
    changehomework(form.value).then(res => {
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
    deletehomework(id).then(res => {
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
    delBatchhomework(multipleSelection.value).then(res => {
        if (res.code === '0') {
            window.$message.success("批量删除成功")
            findBySearch()
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
.centered-text {
    display: flex;
    justify-content: center;
    align-items: center;
    height: 100%;
}

.container {
    display: flex;
    margin-top: 10px;
    align-content: center;
    justify-content: center;

}
</style>