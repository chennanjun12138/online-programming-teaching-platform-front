<template>
    <div>

        <div>
            <el-table :header-cell-style="{ background: 'rgb(102, 177, 255)', color: '#606266', textAlign: 'center' }"
                :data="tableData.slice((params.pageNum - 1) * params.pageSize, params.pageNum * params.pageSize)" stripe
                style="width: 100%; margin: 15px 0px " ref="table" :row-key="getRowKeys"
                :cell-style="{ textAlign: 'center' }">
                <el-table-column min-width="40%" label="排名">
                    <template #default="{ row }">
                        <span v-if="(params.pageNum - 1) * params.pageSize + tableData.indexOf(row) + 1 == 1"> <img
                                style="width: 60px; height: 60px; border-radius: 100%;" src="@/assets/image/one.jpg" />
                        </span>
                        <span v-else-if="(params.pageNum - 1) * params.pageSize + tableData.indexOf(row) + 1 == 2">
                            <img style="width: 60px; height: 60px; border-radius: 100%;"
                                src="@/assets/image/silver.jpeg" /></span>
                        <span v-else-if="(params.pageNum - 1) * params.pageSize + tableData.indexOf(row) + 1 == 3">
                            <img style="width: 60px; height: 60px; border-radius: 100%;"
                                src="@/assets/image/copper.jpg" />
                        </span>
                        <span v-else>{{ (params.pageNum - 1) * params.pageSize + tableData.indexOf(row) + 1 }} </span>

                    </template>
                </el-table-column>

                <el-table-column prop="name" label="名称"></el-table-column>
                <el-table-column prop="photo" label="头像" width="100px">
                    <template #default="{ row }">
                        <img v-if="row.photo" :src="'http://localhost:8080/api/files/' + row.photo" class="avatar">
                        <img v-else class="avatar" style="color: rgb(116, 118, 118);" src="@/assets/logo.svg">

                        </img>
                    </template>

                </el-table-column>
                <el-table-column prop="solvenum" label="ac数量"></el-table-column>
                <el-table-column prop="submitnum" label="提交数量"></el-table-column>
                <el-table-column prop="pass" label="通过率">
                    <template #default="{ row }">

                        <span v-if="row.submitnum != 0">{{ (row.solvenum / row.submitnum * 100).toFixed(1) }}
                            %</span>
                        <span v-else>未提交</span>

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

    </div>
</template>

<script setup>
import { ref } from 'vue';
import { getusers, getallsubmit } from "@/api/index.js";

let params = ref({
    name: '',
    phone: '',
    role: '',
    pageNum: 1,
    pageSize: 5
})
let total = ref(0);
let tableData = ref([]);

const sortTableData = () => {
    tableData.value = tableData.value.slice().sort((a, b) => {
        if (a.solvenum !== b.solvenum) {
            return b.solvenum - a.solvenum; // 先按AC数降序排序
        } else {

            if (a.submitnum === 0 || b.submitnum === 0) {
                return b.submitnum - a.submitnum; // 如果通过数为0，则按通过数降序排序
            } else {
                return a.submitnum - b.submitnum; // 否则按通过数升序排序
            }
        }
    });
};

function findBySearch() {
    getusers(params.value).then(res => {
        if (res) {
            const promises = [];

            for (let i = 0; i < res.data.length; i++) {
                params.value.userid = res.data[i].id;
                promises.push(getallsubmit(params.value).then(submitRes => {
                    let solvenum = 0;
                    for (let j = 0; j < submitRes.data.length; j++) {
                        submitRes.data[j].judgeInfo = JSON.parse(submitRes.data[j].judgeInfo);
                        if (submitRes.data[j].judgeInfo.message === "Accepted") {
                            solvenum++;
                        }
                    }
                    res.data[i].submitnum = submitRes.data.length;
                    res.data[i].solvenum = solvenum;
                }));
            }

            Promise.all(promises).then(() => {
                tableData.value = res.data;
                total.value = res.data.length;
                sortTableData();
            }).catch((error) => {
                console.log(error);
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


function getRowKeys(row) {
    return row.id;
}
</script>

<style>
.avatar {
    width: 60px;
    height: 60px;
    border-radius: 50%;
}
</style>