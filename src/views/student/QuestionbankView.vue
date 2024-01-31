<template>
    <div>

        <div>
            <el-input v-model="params.name" style="width: 200px" placeholder="请输入题目名"></el-input>
            <el-input v-model="params.creator" style="width: 200px; margin-left: 5px" placeholder="请输入题目创建者"></el-input>

            <el-button type="warning" style="margin-left: 10px" @click="findBySearch()">查询</el-button>
            <el-button type="warning" @click="reset()">清空</el-button>

        </div>
        <div>
            <el-table :data="tableData" style="width: 100%; margin: 15px 0px" ref="table"
                @selection-change="handleSelectionChange" :row-key="getRowKeys">
                <el-table-column ref="table" type="selection" width="55"  
                    :reserve-selection="true"></el-table-column>
                <el-table-column width="60px" prop="questionid" label="题号"></el-table-column>

                <el-table-column prop="name" label="题目名称"></el-table-column>
                <el-table-column prop="type" label="题目类型"></el-table-column>

                <el-table-column prop="description" label="题目描述"></el-table-column>
                <el-table-column prop="creator" label="创建者" width="80px"></el-table-column>
                <el-table-column prop="createtime" label="创建时间"></el-table-column>
                <el-table-column label="操作">
                    <template #default="{ row }">
                        <el-button type="primary" @click="gotoquestion( row.questionid)">练习</el-button>

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
                        <el-input v-model="form.creator" readonly autocomplete="off" style="width: 90%"></el-input>
                    </el-form-item>

                    <el-form-item label="题目描述" label-width="25%">
                        <el-input v-model="form.description" autocomplete="off" style="width: 90%"></el-input>
                    </el-form-item>
                </el-form>
                <div slot="footer" class="dialog-footer">
                    <el-button type="info" @click="dialogFormVisible = false">取 消</el-button>
                    <el-button type="primary" @click="submit()">确 定</el-button>
                </div>
            </el-dialog>
        </div>
    </div>
</template>
    
<script setup>
import { ref } from 'vue';
import { changequestionbank, delBatchquestionbank, deletequestionbank, findquestionbanks } from "@/api/index.js";
import { useRouter, RouterLink } from "vue-router";
const router = useRouter()
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
let multipleSelection = ref([]);
let form = ref({})
const user = ref(localStorage.getItem("user") ? JSON.parse(localStorage.getItem("user")) : {})

function gotoquestion(questionid) {
    router.push(`/questioncontent/${questionid}`)
}
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
        creator: user.value.name
    };
    dialogFormVisible.value = true;
}
function edit(obj) {
    form.value = obj;
    dialogFormVisible.value = true;
}
function submit() {
    changequestionbank(form.value).then(res => {
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
    deletequestionbank(id).then(res => {
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
function successUpload(res) {
    form.value.img = res.data;

}
function down(flag) {
    location.href = 'http://localhost:8080/api/files/' + flag
}
function handleSelectionChange(val) {
    multipleSelection.value = val;
}
function delBatch() {
    if (multipleSelection.value.length === 0) {
        window.$message.warning("请勾选您要删除的项")
        return
    }
    delBatchquestionbank(multipleSelection.value).then(res => {
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
.container {
    display: flex;
    align-content: center;
    justify-content: center;

}
</style>