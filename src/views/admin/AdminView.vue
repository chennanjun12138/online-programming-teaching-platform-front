<template>
    <div>

        <div>
            <el-input v-model="params.name" style="width: 200px" placeholder="请输入姓名"></el-input>
            <el-input v-model="params.phone" style="width: 200px; margin-left: 5px" placeholder="请输入电话"></el-input>
            <el-select v-model="params.role" clearable placeholder="请选择角色" style="margin-left: 5px ;width: 200px; ">
                <el-option v-for="item in options" :key="item.value" :label="item.label" :value="item.value">
                </el-option>
            </el-select>
            <el-button type="primary" style="margin-left: 10px" @click="findBySearch()" :icon="Search">查询</el-button>
            <el-button type="warning" @click="reset()">清空</el-button>
            <el-button type="success" style="margin-left: 10px" @click="add()" :icon="Plus">新增</el-button>
            <el-popconfirm title="确定删除这些数据吗？" @confirm="delBatch()">
                <template #reference>
                    <el-button type="danger" style="margin-left: 5px" :icon="Delete">批量删除</el-button>
                </template>
            </el-popconfirm>
        </div>
        <div>
            <el-table :header-cell-style="{ textAlign: 'center', background: '#eef1f6', color: '#606266' }"
                :data="tableData" stripe style="width: 100%; margin: 15px 0px" ref="table"
                @selection-change="handleSelectionChange" :row-key="getRowKeys" :cell-style="{ textAlign: 'center' }">
                <el-table-column ref="table" type="selection" width="40px" :reserve-selection="true"></el-table-column>
                <el-table-column prop="id" label="ID" width="70px"></el-table-column>
                <el-table-column prop="name" label="姓名" width="100px"></el-table-column>
                <el-table-column prop="sex" label="性别" width="70px"></el-table-column>
                <el-table-column prop="age" label="年龄" width="70px"></el-table-column>
                <el-table-column label="通过率(AC/提交)" width="140px" >
                    <template #default="{ row }">
                        <span>
                            {{ getnum(row.id, 0) }}/{{ getnum(row.id, 1) }}
                        </span>
                    </template>
                </el-table-column>
                <el-table-column prop="phone" label="电话"  width="130px" ></el-table-column>

                <el-table-column prop="role" label="角色" width="60px">
                    <template #default="{ row }">
                        {{ maprol[row.role] }}
                    </template>
                </el-table-column>
                <el-table-column label="操作">
                    <template #default="{ row }">
                        <el-button v-if="getnum(row.id, 1)!=0" type="primary" @click="show(row.id)" :icon="Search">查看</el-button>
                        <el-button v-else type="primary"    disabled>未做题</el-button>
                        <el-button type="primary" @click="edit(row)" :icon="Edit">编辑</el-button>

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
            <el-dialog title="请填写信息" v-model="dialogFormVisible" width="30%">
                <el-form :model="form">
                    <el-form-item label="姓名" label-width="15%">
                        <el-input v-model="form.name" autocomplete="off" style="width: 90%"></el-input>
                    </el-form-item>
                    <el-form-item label="性别" label-width="15%">
                        <el-radio v-model="form.sex" label="男">男</el-radio>
                        <el-radio v-model="form.sex" label="女">女</el-radio>
                    </el-form-item>
                    <el-form-item label="年龄" label-width="15%">
                        <el-input v-model="form.age" autocomplete="off" style="width: 90%"></el-input>
                    </el-form-item>
                    <el-form-item label="电话" label-width="15%">
                        <el-input v-model="form.phone" autocomplete="off" style="width: 90%"></el-input>
                    </el-form-item>
                    <el-form-item label="角色" label-width="15%">
                        <el-select v-model="form.role" placeholder="请选择" style="width: 90%">
                            <el-option label="教师" value="ROLE_TEACHER"></el-option>
                            <el-option label="学生" value="ROLE_STUDENT"></el-option>
                        </el-select>
                    </el-form-item>
                </el-form>
                <div class="container">
                    <el-button @click="dialogFormVisible = false">取 消</el-button>
                    <el-button type="primary" @click="submit()">确 定</el-button>
                </div>
            </el-dialog>
            <el-dialog class="chartflex" style="width: 90%;" v-model="contentVisible">
                <Chart ref="pieRef" :QuestionData="questiondata" :SubmitData="submitData" />
            </el-dialog>
        </div>
    </div>
</template>

<script setup>
import { ref } from 'vue';
import { changeuser, findusers, deleteuser, delBatchuser, getallsubmit,findbyquestionid } from "@/api/index.js";
import { Edit, Search, Delete, Plus } from '@element-plus/icons-vue'
import Chart from '@/components/Chart.vue';

let params = ref({
    name: '',
    phone: '',
    role: '',
    pageNum: 1,
    pageSize: 5
})
let total = ref(0);
let tableData = ref([]);
let dialogFormVisible = ref(false);
let form = ref({})
let multipleSelection = ref([]);
const options = ref([{
    value: 'ROLE_STUDENT',
    label: '学生'
}, {
    value: 'ROLE_TEACHER',
    label: '教师'
}]);
const maprol = {
    ROLE_STUDENT: '学生',
    ROLE_TEACHER: '教师'
}
const submitdata = ref([]);
const people_submitdata = ref([]);
let contentVisible = ref(false);
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
let submitData = ref([
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
    submitData.value = [
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
                submitData.value.forEach(item => {
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
function show(id) {
    down(id);
    contentVisible.value = true;

}
function getnum(id, flag) {
    const userIndex = people_submitdata.value.findIndex(item => item.id === id);
    if (flag == 0) {
        return people_submitdata.value[userIndex].solvenum;
    }
    else {
        return people_submitdata.value[userIndex].submitnum;
    }
}
function findBySearch() {
    findusers(params.value).then(res => {
        if (res) {
            tableData.value = res.data.list;
            total.value = res.data.total;
            people_submitdata.value = [];
            for (let i = 0; i < tableData.value.length; i++) {
                people_submitdata.value.push({
                    id: tableData.value[i].id,
                    submitnum: 0,
                    solvenum: 0
                })
            }
            console.log("看这里"+people_submitdata.value);
            definesubmit()
        }
    })
}
function definesubmit() {

    getallsubmit(params.value).then(res => {
        if (res) {
            submitdata.value = res.data;
            for (let i = 0; i < submitdata.value.length; i++) {
                submitdata.value[i].judgeInfo = JSON.parse(submitdata.value[i].judgeInfo);
                const userIndex = people_submitdata.value.findIndex(item => item.id === submitdata.value[i].userid);
                if (userIndex !== -1) {
                    // 修改找到的元素
                    people_submitdata.value[userIndex].submitnum += 1;
                    if (submitdata.value[i].judgeInfo.message === "Accepted") {
                        people_submitdata.value[userIndex].solvenum += 1;
                    }
                }
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
function edit(obj) {
    form.value = obj;
    dialogFormVisible.value = true;
}
function submit() {
    changeuser(form.value).then(res => {
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
    deleteuser(id).then(res => {
        if (res) {
            window.$message({
                message: '删除成功',
                type: 'success'
            });
            findBySearch();
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
    delBatchuser(multipleSelection.value).then(res => {
        if (res) {
            window.$message.success("批量删除成功")
            findBySearch()
        }
    })
}
function getRowKeys(row) {
    return row.id;
}
</script>

<style></style>