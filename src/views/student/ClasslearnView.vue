<template>
  <div>
    <div>
      <el-input v-model="params.name" style="width: 200px" placeholder="请输入课程名"></el-input>
      <el-input v-model="params.author" style="width: 200px; margin-left: 5px" placeholder="请输入课程教师"></el-input>
      <el-button type="warning" style="margin-left: 10px" @click="findBySearch()">查询</el-button>
      <el-button type="warning" @click="reset()">清空</el-button>
    </div>

    <div>
      <el-table :data="tableData" style="width: 100%; margin: 15px 0px" :row-key="getRowKeys">
        <el-table-column prop="img" label="课程封面">
          <template #default="{ row }">
            <el-image style="width: 75px; height: 75px;border-radius: 50% "
              :src="'http://localhost:8080/api/files/' + row.img"
              :preview-src-list="['http://localhost:8080/api/files/' + row.img]">
            </el-image>
          </template>
        </el-table-column>
        <el-table-column prop="name" label="课程名"></el-table-column>
        <el-table-column prop="sort" label="课程分类"></el-table-column>
        <el-table-column prop="author" label="课程教师" width="80px"></el-table-column>
        <el-table-column label="操作">
          <template #default="{ row }">
            <el-button type="primary" @click="joinlearn(row.id, row.author, row.content)">学习</el-button>
            <el-button type="primary" @click="searchcourse(row.id)">查看</el-button>
            <el-button type="primary" @click="down(row.content)">下载</el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <div style="margin-top: 10px">
      <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="params.pageNum"
        :page-sizes="[5, 10, 15, 20]" :page-size="params.pageSize" layout="total, sizes, prev, pager, next"
        :total="total">
      </el-pagination>

    </div>
    <div>
      <el-dialog title="课程简介" v-model="courseVisible" width="30%" center>
        <el-form :model="courescontent">
          <el-form-item label="课程描述:" label-width="25%">
            <span style="width: 90%">{{ courescontent.description }}</span>
          </el-form-item>

          <el-form-item label="具体详情:" label-width="25%">
            <span style="width: 90%">{{ courescontent.details }}</span>
          </el-form-item>
        </el-form>
      </el-dialog>
      <el-dialog title="请填写信息" v-model="dialogFormVisible" width="30%">
        <el-form :model="form">
          <el-form-item label="课程封面" label-width="25%">
            <el-upload action="http://localhost:8080/api/files/upload" :on-success="successUpload">
              <el-button size="small" type="primary">点击上传</el-button>
            </el-upload>
          </el-form-item>
          <el-form-item label="课程名" label-width="25%">
            <el-input v-model="form.name" autocomplete="off" style="width: 90%"></el-input>
          </el-form-item>

          <el-form-item label="课程分类" label-width="25%">
            <el-input v-model="form.sort" autocomplete="off" style="width: 90%"></el-input>
          </el-form-item>
          <el-form-item label="课程教师" label-width="25%">
            <el-input v-model="form.author" autocomplete="off" style="width: 90%"></el-input>
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
    
<script setup>
import { ref } from 'vue';
import { addconnect, changeclass, findclasss, findcourse } from "@/api/index.js";
import { useRouter, RouterLink } from "vue-router";
const router = useRouter()
let params = ref({
  name: '',
  phone: '',
  author: '',
  flag: '',
  pageNum: 1,
  pageSize: 5,
  classid: 0,
})
let total = ref(0);
let tableData = ref([]);
let dialogFormVisible = ref(false);
let courseVisible = ref(false);
let courescontent = ref({})
let form = ref({})
let link = ref({})
let url = ref('')
let textarea = ref("")
const user = ref(localStorage.getItem("user") ? JSON.parse(localStorage.getItem("user")) : {})
function searchcourse(id) {
  console.log("clasid:" + id);
  params.value.classid = id;
  findcourse(params.value).then(res => {
    if (res.code === '0') {
      courescontent.value = res.data;
      console.log(res.data);
      courseVisible.value = true;
    } else {
      window.$message({
        message: res.msg,
        type: 'error'
      });
    }
  })
}

// methods里定义一个findBySearch
function findBySearch() {
  findclasss(params.value).then(res => {
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


function edit(obj) {
  form.value = obj;
  dialogFormVisible.value = true;
}
function submit() {
  changeclass(form.value).then(res => {
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

function successUpload(res) {
  form.value.img = res.data;
}
function down(flag) {
  location.href = 'http://localhost:8080/api/files/' + flag
}
function joinlearn(id, author, fileId) {
  link.value.teacherid = id.toString();
  link.value.teachername = author;
  link.value.studentid = user.value.id.toString();
  link.value.studentname = user.value.name;
  addconnect(link.value).then(res => {
    if (res.code === '0') {
      window.$message({
        message: '操作成功',
        type: 'success'
      });
    } else {
      window.$message({
        message: res.msg,
        type: 'success'
      });
    }
  })

  router.push({
    path: '/ClassDetail/' + fileId,
    query: { classId: id },
  });
}
function excelTextChanged(text) {
  console.log("text", text)
  textarea.value = text
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