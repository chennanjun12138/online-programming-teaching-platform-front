<template>
    <div>

        <div>
            <el-input v-if="tableVisible" v-model="params.name" style="width: 200px" placeholder="请输入课程名"></el-input>
            <el-input v-if="tableVisible && props.msg != 'A'" v-model="params.author"
                style="width: 200px; margin-left: 5px" placeholder="请输入课程教师"></el-input>
            <el-select v-if="tableVisible" v-model="params.sort" clearable placeholder="请选择课程类型"
                style="width: 200px;margin-left: 5px">
                <el-option v-for="item in options" :key="item.value" :label="item.label" :value="item.value">
                </el-option>
            </el-select>
            <el-button v-if="tableVisible" type="primary" style="margin-left: 10px" @click="findBySearch()"
                :icon="Search">查询</el-button>
            <el-button v-if="tableVisible" type="warning" @click="reset()">清空</el-button>
            <el-button v-if="tableVisible" type="success" style="margin-left: 10px" @click="add()"
                :icon="Plus">新增</el-button>
            <el-popconfirm v-if="tableVisible" title="确定删除这些数据吗？" @confirm="delBatch()">
                <template #reference>
                    <el-button type="danger" style="margin-left: 5px" :icon="Delete">批量删除</el-button>
                </template>
            </el-popconfirm>
            <el-button v-if="tableVisible2" type="warning" style="margin-left: 10px" @click="reback()"
                :icon="Back">返回</el-button>
            <el-popconfirm v-if="tableVisible2" title="确定添加这些数据吗？" @confirm="addBatch()">
                <template #reference>
                    <el-button type="primary" style="margin-left: 5px" :icon="Plus">批量增加</el-button>
                </template>
            </el-popconfirm>

        </div>
        <div>
            <el-table v-if="tableVisible"
                :header-cell-style="{ textAlign: 'center', background: '#eef1f6', color: '#606266' }" :data="tableData"
                style="width: 100%; margin: 15px 0px" ref="table" :cell-style="{ textAlign: 'center' }"
                @selection-change="handleSelectionChange" :row-key="getRowKeys">
                <el-table-column ref="table" type="selection" width="55" :reserve-selection="true"></el-table-column>
                <el-table-column prop="img" label="课程封面">
                    <template #default="{ row }">

                        <el-image preview-teleported="true" style="width: 75px; height: 75px;border-radius: 50% "
                            :src="'http://localhost:8080/api/files/' + row.img"
                            :preview-src-list="['http://localhost:8080/api/files/' + row.img]">
                        </el-image>

                    </template>
                </el-table-column>
                <el-table-column prop="name" label="课程名" width="100px"></el-table-column>
                <el-table-column prop="sort" label="课程分类" width="150px"></el-table-column>
                <el-table-column prop="author" label="课程教师"></el-table-column>
                <el-table-column label="操作" width="500px">
                    <template #default="{ row }">
                        <el-button type="primary" @click="edit(row)" :icon="Edit">编辑</el-button>
                        <el-button type="primary" @click="searchcourse(row.id)" :icon="Search">查看</el-button>
                        <el-button type="warning" @click="down(row.content)" :icon="Download">下载</el-button>
                        <el-button type="success" @click="findquestions(row.id)" :icon="Plus">添加</el-button>
                        <el-popconfirm title="确定删除吗？" @confirm="del(row.id)">
                            <template #reference>
                                <el-button type="danger" style="margin-left: 5px" :icon="Delete">删除</el-button>
                            </template>
                        </el-popconfirm>
                    </template>
                </el-table-column>
            </el-table>
            <el-table v-if="tableVisible2"
                :header-cell-style="{ textAlign: 'center', background: '#eef1f6', color: '#606266' }"
                :data="questiondata" style="width: 100%; margin: 15px 0px" ref="table"
                :cell-style="{ textAlign: 'center' }" @selection-change="handleSelectionChange" :row-key="getRowKeys">
                <el-table-column ref="table" type="selection" width="55" :reserve-selection="true"></el-table-column>
                <el-table-column width="60px" prop="questionid" label="题号"></el-table-column>

                <el-table-column prop="name" label="题目名称"></el-table-column>
                <el-table-column prop="type" label="题目类型"></el-table-column>

                <el-table-column prop="description" label="题目描述"></el-table-column>
                <el-table-column prop="creator" label="创建者" width="80px"></el-table-column>
                <el-table-column prop="createtime" label="创建时间"></el-table-column>
                <el-table-column label="操作">
                    <template #default="{ row }">
                        <el-button v-if="isNumberInArray(row.questionid) === 1" type="primary"
                            @click="insertcontract(row.questionid)" :icon="Plus">添加</el-button>
                        <el-button v-else type="danger" :icon="CircleClose"
                            @click="throwcontract(row.questionid)">取消</el-button>
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
                    <el-form-item label="课程封面" label-width="25%">
                        <el-upload action="http://localhost:8080/api/files/upload" :on-success="successUpload"
                            :on-change="changeUpload">
                            <el-button size="small" type="primary" :icon="Upload">点击上传</el-button>
                        </el-upload>
                    </el-form-item>
                    <el-form-item label="课程名" label-width="25%">
                        <el-input v-model="form.name" autocomplete="off" style="width: 90%"></el-input>
                    </el-form-item>

                    <el-form-item label="课程分类" label-width="25%">
                        <el-select v-model="form.sort" autocomplete="off" style="width: 90%" placeholder="请选择课程类型">
                            <el-option v-for="item in options" :key="item.value" :label="item.label"
                                :value="item.value">
                            </el-option>
                        </el-select>
                        <!-- <el-input v-model="form.sort" autocomplete="off" style="width: 90%"></el-input> -->
                    </el-form-item>
                    <el-form-item v-if="props.msg != 'A'" label="课程教师" label-width="25%">
                         <el-input  v-model="form.author" autocomplete="off" style="width: 90%"></el-input>
                    </el-form-item>

                    <el-form-item label="课程文件" label-width="25%">
                        <el-upload action="http://localhost:8080/api/files/upload" :on-success="successUploadpdf"
                            :on-change="changeUpload">
                            <el-button size="small" type="primary" :icon="Upload">点击上传</el-button>
                        </el-upload>
                    </el-form-item>
                </el-form>
                <div class="container">
                    <el-button @click="dialogFormVisible = false">取 消</el-button>
                    <el-button type="primary" @click="submit()">确 定</el-button>
                </div>
            </el-dialog>
            <el-dialog title="课程简介" v-model="courseVisible" width="60%" center>
                <el-form :model="courescontent">
                    <el-form-item label="课程描述" label-width="25%">
                        <el-input v-model="courescontent.description" autocomplete="off" style="width: 90%"
                            type="textarea"></el-input>
                    </el-form-item>

                    <el-form-item label="具体详情" label-width="25%">
                        <el-input v-model="courescontent.details" autocomplete="off" style="width: 90%"
                            type="textarea"></el-input>
                    </el-form-item>
                </el-form>
                <div class="container">
                    <el-button type="info" @click="courseVisible = false">取 消</el-button>
                    <el-button type="primary" @click="savecourse()">确 定</el-button>
                </div>
            </el-dialog>
        </div>
    </div>
</template>

<script setup>


import { ref } from 'vue';
const props = defineProps({
    msg: String,
})

import {
    changeclass, delBatchclass, deleteclass, findclasss, deletecontract,
    findcourse, findquestionbanks, submitcourse, addcontract, findbyquestionid, addBatchcontract, judgecontract, findteachers
} from "@/api/index.js";
import { Edit, Search, Delete, Plus, Back, Upload, Download, CircleClose } from '@element-plus/icons-vue'


let params = ref({
    name: '',
    phone: '',
    author: '',
    pageNum: 1,
    pageSize: 5,
    classid: 0,
})
let total = ref(0);
let tableData = ref([]);
let questiondata = ref([]);
let tableVisible = ref(true);
let tableVisible2 = ref(false);
let classid = ref(0);
let multipleSelection = ref([]);
let multiContracts = ref([]);
let status = ref([]);
let conteact = ref({
    classid: 0,
    questionid: 0,
});
let dialogFormVisible = ref(false);
let courseVisible = ref(false);
let courescontent = ref({})
let form = ref({})
let allquestiondata = ref([])
const options = ref([{
    value: '前端开发',
    label: '前端开发'
}, {
    value: 'Web开发',
    label: 'Web开发'
},
{
    value: '编程语言',
    label: '编程语言'
},
{
    value: '后端开发',
    label: '后端开发'
},
{
    value: '移动应用开发',
    label: '移动应用开发'
},
{
    value: '人工智能',
    label: '人工智能'
},
{
    value: '网络安全',
    label: '网络安全'
},
{
    value: '编程基础',
    label: '编程基础'
},
{
    value: '云计算和大数据',
    label: '云计算和大数据'
},
{
    value: '自动化和物联网',
    label: '自动化和物联网'
},
],);
const user = ref(localStorage.getItem("user") ? JSON.parse(localStorage.getItem("user")) : {})

function findBySearch() {
    // console.log(props.msg);
    if (props.msg === 'A') {
        params.value.author = user.value.name;
    }
    findclasss(params.value).then(res => {

        tableData.value = res.data.list;
        //   console.log(tableData.value);
        total.value = res.data.total;
        //  console.log(total.value);

    })
}
findBySearch();
function reback() {
    tableVisible2.value = false;
    tableVisible.value = true;
    findBySearch();
}
function insertcontract(id) {
    form.value = {}
    form.value.classid = classid.value;
    form.value.questionid = id;
    addcontract(form.value).then(res => {

        // console.log(res.data);
        if (res.data == 1) {
            window.$message({
                message: '添加成功',
                type: 'success'
            });
            findquestions(classid.value);
        }
        else {
            window.$message({
                message: '早已添加',
                type: 'success'
            });

        }

    })
}
function throwcontract(id) {
    form.value = {}
    form.value.classid = classid.value;
    form.value.questionid = id;
    deletecontract(form.value).then(res => {
        if (res) {
            window.$message({
                message: '取消成功',
                type: 'success'
            });
            findquestions(classid.value);
        }
    })
}
function searchcourse(id) {
    params.value.classid = id;
    findcourse(params.value).then(res => {

        if (res.data != null) {
            courescontent.value = res.data;
        }
        else {
            courescontent.value = {};
            courescontent.value.classid = id;
        }
        courseVisible.value = true;

    })
}

function isNumberInArray(number) {

    if (status.value.includes(number)) {

        return 1;//未添加
    }
    else {
        return 0;//已添加
    }

}

function findquestions(id) {
    if (tableVisible.value == true) {
        params.value.pageNum = 1
        params.value.pageSize = 5
        findbyquestionid(params.value).then(
            res => {
                allquestiondata.value = res.data;
            }
        )
    }
    classid.value = id;

    findquestionbanks(params.value).then(res => {

        questiondata.value = res.data.list;
        total.value = res.data.total;
        status.value = [];
        for (let i = 0; i < res.data.total; i++) {
            form.value = {}
            form.value.classid = id;
            form.value.questionid = allquestiondata.value[i].questionid;
            judgecontract(form.value).then(res => {
                if (res.data !== 0) {
                    status.value.push(res.data.toString());
                }
            }
            )
        }
        tableVisible2.value = true;
        tableVisible.value = false;
    })
    // console.log(status.value)
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
    if (tableVisible.value === true) {
        findBySearch();
    }
    else {
        findquestions(classid.value);
    }

}
function handleCurrentChange(pageNum) {
    params.value.pageNum = pageNum;
    if (tableVisible.value === true) {
        findBySearch();
    }
    else {
        findquestions(classid.value);
    }
}

function add() {
    form.value = {};
    if (props.msg === 'A') {
        form.value.author = user.value.name;
    }
    dialogFormVisible.value = true;
}
function edit(obj) {
    form.value = obj;
    dialogFormVisible.value = true;
}
function savecourse() {
    submitcourse(courescontent.value).then(res => {
        if (res) {
            window.$message({
                message: '操作成功',
                type: 'success'
            });
            courseVisible.value = false;
        }
    })
}
function submit() {
    changeclass(form.value).then(res => {
        if (res) {
            window.$message({
                message: '操作成功',
                type: 'success'
            });
            dialogFormVisible.value = false;
            findBySearch();
        }


    })
}
function del(id) {
    deleteclass(id).then(res => {

        window.$message({
            message: '删除成功',
            type: 'success'
        });
        findBySearch();

    })
}
function handleSelectionChange(val) {
    multipleSelection.value = val;
    multiContracts.value = [];
    for (let i = 0; i < val.length; i++) {
        conteact.value = {}
        conteact.value.classid = classid;
        conteact.value.questionid = val[i].questionid;
        // console.log(conteact.questionid);
        multiContracts.value.push(conteact.value);
    }
}
function addBatch() {
    if (multiContracts.value.length === 0) {
        $message.warning("请勾选您要添加的项")
        return
    }
    addBatchcontract(multiContracts.value).then(res => {

        window.$message.success("批量添加成功")


    })
}
function delBatch() {
    if (multipleSelection.value.length === 0) {
        window.$message.warning("请勾选您要删除的项")
        return
    }
    delBatchclass(multipleSelection.value).then(res => {

        window.$message.success("批量删除成功");
        findBySearch();

    })
} function successUpload(res) {
    form.value.img = res.data;
}
function successUploadpdf(res) {

    form.value.content = res.data;
}
function changeUpload(file, list) {
    if (list.length > 1 && file.status !== "fail") {
        list.splice(0, 1);
    } else if (file.status === "fail") {
        errorMsg("上传失败，请重新上传！");
        list.splice(0, 1);
    }
}
function down(flag) {
    location.href = 'http://localhost:8080/api/files/' + flag
}
function getRowKeys(row) {
    return row.id;
}


</script>

<style></style>