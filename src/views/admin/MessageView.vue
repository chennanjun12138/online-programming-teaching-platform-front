<template>
    <div>

        <div>
            <el-input v-if="tableVisible" v-model="params.sendname" style="width: 200px"
                placeholder="请输入发送者用户名"></el-input>
            <el-input v-if="tableVisible" v-model="params.acceptname" style="width: 200px;margin-left: 5px "
                placeholder="请输入接收者用户名"></el-input>
            <el-button v-if="tableVisible2" type="warning" style="margin-left: 10px;margin-right: 10px"
                @click="findBySearch()" :icon="Back">返回</el-button>
            <el-input v-if="tableVisible2" v-model="params.name" style="width: 200px" placeholder="请输入姓名"></el-input>
            <el-input v-if="tableVisible2" v-model="params.phone" style="width: 200px; margin-left: 5px"
                placeholder="请输入电话"></el-input>
            <el-select v-if="tableVisible2" v-model="params.role" clearable placeholder="请选择角色"
                style="margin-left: 5px ;width: 200px; ">
                <el-option v-for="item in options" :key="item.value" :label="item.label" :value="item.value">
                </el-option>
            </el-select>
            <el-button v-if="tableVisible" type="primary" style="margin-left: 10px" @click="findBySearch()"
                :icon="Search">查询</el-button>
            <el-button v-if="tableVisible2" type="primary" style="margin-left: 10px" @click="send()"
                :icon="Search">查询</el-button>

            <el-button type="warning" @click="reset()">清空</el-button>
            <el-button v-if="tableVisible2" type="success" style="margin-left: 10px" @click="add()"
                :icon="Promotion">发送</el-button>
            <el-button v-if="tableVisible" type="success" style="margin-left: 10px" @click="send()"
                :icon="Promotion">消息发送</el-button>
        </div>
        <div>
            <el-table :header-cell-style="{ textAlign: 'center', background: '#eef1f6', color: '#606266' }"
                v-if="tableVisible"
                :data="messageData.slice((params.pageNum - 1) * params.pageSize, params.pageNum * params.pageSize)"
                stripe style="width: 100%; margin: 15px 0px" ref="table" @selection-change="handleSelectionChange"
                :row-key="getRowKeys" :cell-style="{ textAlign: 'center' }">

                <el-table-column prop="id" label="ID"></el-table-column>
                <el-table-column prop="sendid" label="发送者id"></el-table-column>
                <el-table-column prop="sendname" label="发送者"></el-table-column>
                <el-table-column prop="content" label="发送内容"> </el-table-column>
                <el-table-column prop="acceptid" label="接收者id"></el-table-column>
                <el-table-column prop="acceptname" label="接收者"></el-table-column>
                <el-table-column prop="sendtime" label="发送时间"></el-table-column>
                <el-table-column label="操作">
                    <template #default="{ row }">
                        
                        <el-popconfirm title="确定删除吗" @confirm="del(row.id)">
                            <template #reference>
                                <el-button type="danger" style="margin-left: 5px" :icon="Delete">删除</el-button>
                            </template>
                        </el-popconfirm>
                    </template>
                </el-table-column>
            </el-table>
            <el-table :header-cell-style="{ textAlign: 'center', background: '#eef1f6', color: '#606266' }"
                :data="tableData" stripe style="width: 100%; margin: 15px 0px" ref="table" v-if="tableVisible2"
                @selection-change="handleSelectionChange" :row-key="getRowKeys" :cell-style="{ textAlign: 'center' }">
                <el-table-column ref="table" type="selection" width="40px" :reserve-selection="true"></el-table-column>
                <el-table-column prop="id" label="ID"></el-table-column>
                <el-table-column prop="name" label="姓名"></el-table-column>
                <el-table-column prop="sex" label="性别"></el-table-column>
                <el-table-column prop="age" label="年龄"></el-table-column>
                <el-table-column label="通过率(AC/提交)">
                    <template #default="{ row }">
                        <span>
                            {{ getnum(row.id, 0) }}/{{ getnum(row.id, 1) }}
                        </span>
                    </template>
                </el-table-column>
                <el-table-column prop="phone" label="电话"></el-table-column>

                <el-table-column prop="role" label="角色">
                    <template #default="{ row }">
                        {{ maprol[row.role] }}
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
import { findusers, getallsubmit, findmessage, sendmessage,deletemessage } from "@/api/index.js";
import { Search, Promotion, Back,Delete } from '@element-plus/icons-vue'


let params = ref({
    name: '',
    phone: '',
    role: '',
    pageNum: 1,
    pageSize: 5
})
let total = ref(0);
let tableData = ref([]);
let messageData = ref([]);
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
let sendVisible = ref(false);
let tableVisible = ref(true);
let tableVisible2 = ref(false);
let multipleMessage = ref([])
let Message = ref({})
const user = ref(localStorage.getItem("user") ? JSON.parse(localStorage.getItem("user")) : {})

function send() {

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
            definesubmit()
            tableVisible.value = false;
            tableVisible2.value = true;
        }
    })

}
function add() {
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

    findmessage(params.value).then(
        res => {
            if (res) {
                messageData.value = res.data;
                console.log(res.data)
                total.value = res.data.length;
                tableVisible.value = true;
                tableVisible2.value = false;
            }
        }
    )
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
    if (tableVisible.value == true) {
        findBySearch();
    }
    if (tableVisible2.value == true) {
        send();
    }

}
function handleSizeChange(pageSize) {
    params.value.pageSize = pageSize;
    if (tableVisible.value == true) {
        findBySearch();
    }
    else {
        send();
    }

}

function handleCurrentChange(pageNum) {
    params.value.pageNum = pageNum;
    if (tableVisible.value == true) {
        findBySearch();
    }
    else {
        send();
    }

}
function handleSelectionChange(val) {
    multipleSelection.value = val;
    multipleMessage.value = [];
    for (let i = 0; i < val.length; i++) {
        Message.value = {}
        Message.value.sendid = user.value.id;
        Message.value.sendname = user.value.name;
        Message.value.acceptid = val[i].id;
        Message.value.acceptname = val[i].name;
        Message.value.isread = 0;
        multipleMessage.value.push(Message.value);
    }
}
function getRowKeys(row) {
    return row.id;
}
function del(id) {
    deletemessage(id).then(res => {
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

<style></style>