<template>
    <div>

        <div>
            <el-input v-model="params.studentid" style="width: 200px; margin-left: 5px" placeholder="请输入学生号"></el-input>
            <el-button type="primary" style="margin-left: 10px" @click="findBySearch()" :icon="Search">查询</el-button>
            <el-button type="warning" @click="reset()">清空</el-button>
            <el-button type="success" style="margin-left: 10px" @click="add()" :icon="Plus">新增</el-button>
            <el-button type="success" style="margin-left: 10px" @click="send()" :icon="Promotion">发送消息</el-button>

        </div>
        <div>
            <el-table :header-cell-style="{ textAlign: 'center', background: '#eef1f6', color: '#606266' }"
                :data="tableData" stripe :cell-style="{ textAlign: 'center' }" style="width: 100%; margin: 15px 0px"
                ref="table" @selection-change="handleSelectionChange" :row-key="getRowKeys">
                <el-table-column ref="table" type="selection" width="55" :reserve-selection="true"></el-table-column>
                <el-table-column prop="classid" label="课程号"></el-table-column>
                <el-table-column prop="teacherid" label="教师号"></el-table-column>
                <el-table-column prop="teachername" label="教师名"></el-table-column>
                <el-table-column prop="studentid" label="学生号"></el-table-column>
                <el-table-column prop="studentname" label="学生名"></el-table-column>
                <el-table-column label="操作" width="300px">
                    <template #default="{ row }">
                        <el-button type="primary" @click="show(row.studentid)" :icon="Search">查看代码和做题情况</el-button>

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
            <el-dialog title="请填写信息" v-model="dialogFormVisible" width="40%">
                <el-form :model="form">
                    <el-form-item label="课程id" label-width="15%">
                        <el-select v-model="form.classid" clearable placeholder="请选择课程" style="width: 90%">
                            <el-option v-for="item in options" :key="item.value" :label="item.label"
                                :value="item.value">
                            </el-option>
                        </el-select>
                    </el-form-item>

                    <el-form-item label="学生名" label-width="15%">
                        <el-input v-model="form.studentname" autocomplete="off" style="width: 90%"></el-input>
                    </el-form-item>

                </el-form>
                <div class="container">
                    <el-button @click="dialogFormVisible = false">取 消</el-button>
                    <el-button type="primary" @click="submit()">确 定</el-button>
                </div>
            </el-dialog>
            <el-dialog class="chartflex" style="width: 90%;" v-model="contentVisible">
                <Chart ref="pieRef" :QuestionData="questiondata" :SubmitData="submitdata" />
            </el-dialog>
            <el-dialog title="请填写发送内容" style="width: 40%;" v-model="sendVisible">
                <el-form :model="form">
                    <el-form-item label-width="15%">
                        <el-input v-model="form.content" autocomplete="off" autosize style="width: 90% "
                            type="textarea"></el-input>
                    </el-form-item>
                </el-form>
                <div class="container">
                    <el-button @click="sendVisible = false">取 消</el-button>
                    <el-button type="primary" @click="addBatch()">确 定</el-button>
                </div>
            </el-dialog>
        </div>
    </div>
</template>

<script setup>
import { ref } from 'vue';
import { findconnects, deleteconnect, addconnect, findclasss, findByname, getallsubmit, findbyquestionid, sendmessage } from "@/api/index.js";
import Chart from '@/components/Chart.vue';
import { Search, Delete, Plus, Promotion } from '@element-plus/icons-vue'


let params = ref({
    name: '',
    phone: '',
    role: '',
    pageNum: 1,
    pageSize: 5
})
const pieRef = ref()
let total = ref(0);
let tableData = ref([]);
let options = ref([])
let dialogFormVisible = ref(false);
let contentVisible = ref(false);
let sendVisible = ref(false);
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
let multipleSelection = ref([]);
let multipleMessage = ref([]);
let Message = ref({})
let form = ref({})
let ans = ref({})
const user = ref(localStorage.getItem("user") ? JSON.parse(localStorage.getItem("user")) : {})
function down(id) {
    questiondata.value = [
        { value: 0, name: '算法设计与分析' },
        { value: 0, name: '数据结构' },
        { value: 0, name: '字符串处理' },
        { value: 0, name: '数学问题' },
        { value: 0, name: '模拟题' },
        { value: 0, name: '计算几何' },
        { value: 0, name: '动态规划' },
        { value: 0, name: '图论' },
    ]
    submitdata.value = [
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
    ]
    params.value.userid = id;
    getallsubmit(params.value).then(res => {
        if (res) {
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
            params.value.questionid = ''
        }
    })


}
function handleSelectionChange(val) {
    multipleSelection.value = val;
    multipleMessage.value = [];
    for (let i = 0; i < val.length; i++) {
        Message.value = {}
        Message.value.sendid = user.value.id;
        Message.value.sendname = user.value.name;
        Message.value.acceptid = val[i].studentid;
        Message.value.acceptname = val[i].studentname;
        Message.value.isread = 0;
        multipleMessage.value.push(Message.value);
    }
}
function send() {
    sendVisible.value = true;
}
function addBatch() {
    if (multipleSelection.value.length === 0) {
        $message.warning("请勾选您要发送的对象")
        return
    }
    for (let i = 0; i < multipleMessage.value.length; i++) {
        multipleMessage.value[i].content = form.value.content;
    }
    sendmessage(multipleMessage.value).then(
        res => {
            if (res) {
                window.$message({
                    message: '发送成功',
                    type: 'success'
                });
                sendVisible.value = false;
            }

        }
    )
}
function show(id) {
    down(id);
    contentVisible.value = true;

    // nextTick(()=> {
    //     console.log(pieRef.value, '------');
    // })
}
function findBySearch() {
    params.value.teachername = user.value.name;
    findconnects(params.value).then(res => {
        if (res) {
            tableData.value = res.data.list;
            total.value = res.data.total;
        }
    })
    params.value.author = user.value.name;
    findclasss(params.value).then(res => {
        if (res) {
            for (let i = 0; i < res.data.list.length; i++) {
                ans.value = {
                    value: res.data.list[i].id,
                    label: "课程号" + res.data.list[i].id
                }
                options.value.push(ans.value);
            }
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
    form.value = {};
    dialogFormVisible.value = true;
}

function submit() {
    form.value.teacherid = user.value.id;
    form.value.teachername = user.value.name;
    findByname(form.value.studentname).then(
        res => {
            if (res) {
                form.value.studentid = res.data.id.toString();
                // console.log(form.value.studentid);
                addconnect(form.value).then(res => {
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
        }
    )
}
function getRowKeys(row) {
    return row.id;
}
function del(id) {
    deleteconnect(id).then(res => {
        if (res) {
            window.$message({
                message: '删除成功',
                type: 'success'
            });
            findBySearch();
        }
    })
}
</script>

<style>
.chartflex {
    display: flex;
    justify-content: center;

    height: 450px;
}
</style>