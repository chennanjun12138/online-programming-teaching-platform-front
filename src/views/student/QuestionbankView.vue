<template>
    <div>

        <div>
            <el-input v-model="params.name" style="width: 200px" placeholder="请输入题目名"></el-input>
            <el-input v-model="params.creator" style="width: 200px; margin-left: 5px" placeholder="请输入题目创建者"></el-input>
            <el-select v-model="params.type" clearable placeholder="请选择题目类型" style="margin-left: 5px; width: 200px;">
                <el-option v-for="item in options" :key="item.value" :label="item.label" :value="item.value">
                </el-option>
            </el-select>
            <el-button type="warning" style="margin-left: 10px" @click="findBySearch()">查询</el-button>
            <el-button type="warning" @click="reset()">清空</el-button>

        </div>
        <div>
            <el-table :data="tableData" style="width: 100%; margin: 15px 0px" ref="table"
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
import { changequestionbank, findquestionbanks } from "@/api/index.js";
import { useRouter } from "vue-router";
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
let options = ref([
    {
        value: '算法设计与分析',
        label: '算法设计与分析'
    },
    {
        value: '数据结构',
        label: '数据结构'
    },
    {
        value: '数学问题',
        label: '数学问题'
    },
    {
        value: '字符串处理',
        label: '字符串处理'
    },
    {
        value: '计算几何',
        label: '计算几何'
    },
    {
        value: '模拟题',
        label: '模拟题'
    },
    {
        value: '图论',
        label: '图论'
    },
    {
        value: '动态规划',
        label: '动态规划'
    },
]

)
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
 
 
function handleSelectionChange(val) {
    multipleSelection.value = val;
}
 
function getRowKeys(row) {
    return row.id;
}

</script>
    
<style scoped></style>