<template>
    <div>

        <div>
            <el-input v-if="tableVisible" v-model="params.name" style="width: 200px" placeholder="请输入作业名"></el-input>
            <el-input v-if="tableVisible" v-model="params.teacher" style="width: 200px; margin-left: 5px"
                placeholder="请输入作业教师"></el-input>
            <el-button v-if="tableVisible" type="warning" style="margin-left: 10px" @click="findbyteachers()">查询</el-button>
            <el-button v-if="tableVisible2" type="warning" style="margin-left: 10px"
                @click="findbyteachers()">返回</el-button>
            <span v-if="tableVisible2" style="margin-left: 20px">题目说明：{{ notice }}</span>
            <el-button v-if="tableVisible3" type="warning" style="margin-left: 10px"
                @click="findbyteachers()">返回</el-button>
            <el-button v-if="tableVisible" type="warning" @click="reset()">清空</el-button>


        </div>
        <div>
            <el-table :data="tableData" v-if="tableVisible" style="width: 100%; margin: 15px 0px" ref="table"
            :default-sort="[ { prop: 'column1', order: 'descending' }, { prop: 'column2', order: 'ascending' } ]"
                @selection-change="handleSelectionChange" :row-key="getRowKeys">
                <el-table-column width="70px" prop="homeworkid" label="作业号"></el-table-column>
                <el-table-column  prop="name" label="作业名" ></el-table-column>
                <el-table-column prop="teacher" label="作业教师"></el-table-column>
                <el-table-column prop="starttime" sortable  label="开始时间"></el-table-column>
                <el-table-column prop="endtime" sortable label="结束时间"></el-table-column>
                <el-table-column label="操作" width="350px">
                    <template #default="{ row }">
                        <el-button type="primary"
                            @click="searchbyhomework(row.homeworkid, row.content, row.illustrate)">查看</el-button>
                        <el-button type="primary" @click="add(row.homeworkid)">提交</el-button>
                        <el-button type="primary" @click="searchbystudent(row.homeworkid)">提交记录</el-button>
                    </template>
                </el-table-column>
            </el-table>
            <el-table v-if="tableVisible2" :data="questiondata" style="width: 100%; margin: 15px 0px" ref="table"
                @selection-change="handleSelectionChange" :row-key="getRowKeys">
                <el-table-column width="60px" prop="questionid" label="题号"></el-table-column>

                <el-table-column prop="name" label="题目名称"></el-table-column>
                <el-table-column prop="type" label="题目类型"></el-table-column>

                <el-table-column prop="description" label="题目描述"></el-table-column>
                <el-table-column prop="creator" label="创建者" width="80px"></el-table-column>
                <el-table-column prop="createtime" label="创建时间"></el-table-column>
                <el-table-column label="操作">
                    <template #default="{ row }">
                        <el-button type="primary" @click="gotoquestion(row.questionid)">练习</el-button>

                    </template>
                </el-table-column>
            </el-table>
            <el-table v-if="tableVisible3" :data="submitdata" style="width: 100%; margin: 15px 0px" ref="table">
                <el-table-column width="80px" prop="id" label="提交序号"></el-table-column>

                <el-table-column prop="submittime" label="提交时间"></el-table-column>
                <el-table-column prop="content" label="提交内容"></el-table-column>
                <el-table-column prop="score" label="评分" width="60px"></el-table-column>
                <el-table-column prop="teacherevaluate" label="教师评价"></el-table-column>

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
                    <el-form-item label="提交信息" label-width="25%">
                        <el-input v-model="form.content" autocomplete="off" style="width: 90%" type="textarea"></el-input>
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
    
<script setup  >
import { ref } from 'vue';
import {
    addsubmit,
    findbystudent,

    findbyhomework, findbyteacher,
    findteachers,
} from "@/api/index.js";
import { useRouter } from "vue-router";
const router = useRouter()
let params = ref({
    studentid: '',
    name: '',
    phone: '',
    author: '',
    pageNum: 1,
    pageSize: 5,
    content: '',
    teacher: '',
    userid: 0,
    homeworkid: 0,
})
let total = ref(0);
let tableData = ref([]);
let questiondata = ref([]);
let multipleSelection = ref([]);
let dialogFormVisible = ref(false);
let tableVisible = ref(true);
let tableVisible2 = ref(false);
let tableVisible3 = ref(false);
let submitdata = ref([]);
let form = ref({})
let workid = ref('');
let notice = ref('')
const user = ref(localStorage.getItem("user") ? JSON.parse(localStorage.getItem("user")) : {})

function gotoquestion(questionid) {
    router.push(`/questioncontent/${questionid}`)
}
function findbyteachers() {
    params.value.studentid = user.value.id;
    findteachers(params.value).then(res => {
        if (res) {
            console.log("检查结果：");

            const ans = [...new Set(res.data)];
            console.log(ans);
            params.value.teacher = ans.toString();
            findBySearch();
        }
    })
}
findbyteachers();
function getRowKeys(row) {
    return row.id;
}
function findBySearch() {
    console.log(params.value);
    findbyteacher(params.value).then(res => {
        if (res) {

            console.log("变化结果：")
            console.log(res.data);
            tableData.value = res.data.list;
            total.value = res.data.total;
            tableVisible.value = true;
            tableVisible2.value = false;
            tableVisible3.value = false;
        }
    })
      params.value.teacher = '';
}
function reset() {
    params.value = {
        pageNum: 1,
        pageSize: 5,
        name: '',
        phone: ''
    }
    findbyteachers();
}
function handleSizeChange(pageSize) {
    params.value.pageSize = pageSize;
    findbyteachers();
}
function handleCurrentChange(pageNum) {
    params.value.pageNum = pageNum;
    findbyteachers();
}
function searchbystudent(id) {
    params.value.userid = user.value.id;
    params.value.homeworkid = id;
    findbystudent(params.value).then(res => {
        if (res) {
            submitdata.value = res.data.list;
            total.value = res.data.total;
            tableVisible.value = false;
            tableVisible2.value = false;
            tableVisible3.value = true;
        }
    })
}

function searchbyhomework(id, content, illustrate) {
    workid.value = id;
    notice.value = illustrate;
    console.log(id);

    params.value.content = content.substring(1, content.length - 1);
    findbyhomework(params.value).then(res => {
        if (res) {
            questiondata.value = res.data.list;
            total.value = res.data.total;

            tableVisible.value = false;
            tableVisible2.value = true;
        }
    })
}
function add(id) {
    form.value = {};
    form.value.homeworkid = id;
    dialogFormVisible.value = true;
}

function submit() {
    form.value.userid = user.value.id;
    form.value.studentname = user.value.name;
    form.value.homeworkid =
        addsubmit(form.value).then(res => {
            if (res) {
                window.$message({
                    message: '提交成功',
                    type: 'success'
                });
                dialogFormVisible.value = false;

            }
        })
}

function handleSelectionChange(val) {
    multipleSelection.value = val;
} 
</script>
    
<style></style>