<template>
  <div>

    <div>
      <el-input v-if="tableVisible" v-model="params.name" style="width: 200px" placeholder="请输入课程名"></el-input>
      <el-input v-if="tableVisible" v-model="params.author" style="width: 200px; margin-left: 5px"
        placeholder="请输入课程教师"></el-input>
      <el-select v-if="tableVisible" v-model="params.sort" clearable placeholder="请选择课程类型"
        style="width: 200px;margin-left: 5px">
        <el-option v-for="item in options" :key="item.value" :label="item.label" :value="item.value">
        </el-option>
      </el-select>
      <el-button v-if="tableVisible" type="warning" style="margin-left: 10px" @click="findBySearch()">查询</el-button>
      <el-button v-if="tableVisible" type="warning" @click="reset()">清空</el-button>
      <el-button v-if="tableVisible" type="primary" style="margin-left: 10px" @click="add()">新增</el-button>
      <el-popconfirm v-if="tableVisible" title="确定删除这些数据吗？" @confirm="delBatch()">
        <template #reference>
          <el-button type="danger" style="margin-left: 5px">批量删除</el-button>
        </template>
      </el-popconfirm>
      <el-button v-if="tableVisible2" type="warning" style="margin-left: 10px" @click="reback()">返回</el-button>
      <el-popconfirm v-if="tableVisible2" title="确定添加这些数据吗？" @confirm="addBatch()">
        <template #reference>
          <el-button type="primary" style="margin-left: 5px">批量增加</el-button>
        </template>
      </el-popconfirm>

    </div>
    <div>
      <el-table v-if="tableVisible" :data="tableData" style="width: 100%; margin: 15px 0px" ref="table"
        @selection-change="handleSelectionChange" :row-key="getRowKeys">
        <el-table-column ref="table" type="selection" width="55" :reserve-selection="true"></el-table-column>
        <el-table-column prop="img" label="课程封面">
          <template #default="{ row }">
            <el-image style="width: 75px; height: 75px;border-radius: 50% "
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
            <el-button type="primary" @click="edit(row)">编辑</el-button>
            <el-button type="primary" @click="searchcourse(row.id)">查看</el-button>
            <el-button type="primary" @click="down(row.content)">下载</el-button>
            <el-button type="primary" @click="findquestions(row.id)">添加</el-button>
            <el-popconfirm title="确定删除吗？" @confirm="del(row.id)">
              <template #reference>
                <el-button type="danger" style="margin-left: 5px">删除</el-button>
              </template> 
            </el-popconfirm>
          </template>
        </el-table-column>
      </el-table>
      <el-table v-if="tableVisible2" :data="questiondata" style="width: 100%; margin: 15px 0px" ref="table"
        @selection-change="handleSelectionChange">
        <el-table-column ref="table" type="selection" width="55" :reserve-selection="true"></el-table-column>
        <el-table-column width="60px" prop="questionid" label="题号"></el-table-column>

        <el-table-column prop="name" label="题目名称"></el-table-column>
        <el-table-column prop="type" label="题目类型"></el-table-column>

        <el-table-column prop="description" label="题目描述"></el-table-column>
        <el-table-column prop="creator" label="创建者" width="80px"></el-table-column>
        <el-table-column prop="createtime" label="创建时间"></el-table-column>
        <el-table-column label="操作">
          <template #default="{ row }">
            <el-button type="primary" @click="insertcontract(row.questionid)">添加</el-button>
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

          <el-form-item label="课程文件" label-width="25%">
            <el-upload action="http://localhost:8080/api/files/upload" :on-success="successUploadpdf">
              <el-button size="small" type="primary">点击上传</el-button>
            </el-upload>
          </el-form-item>
        </el-form>
        <div  class="container">
          <el-button type="info" @click="dialogFormVisible = false">取 消</el-button>
          <el-button type="primary" @click="submit()">确 定</el-button>
        </div>
      </el-dialog>
      <el-dialog title="课程简介" v-model="courseVisible" width="30%" center>
        <el-form :model="courescontent">
          <el-form-item label="课程描述" label-width="25%">
            <el-input v-model="courescontent.description" autocomplete="off" style="width: 90%"></el-input>
          </el-form-item>

          <el-form-item label="具体详情" label-width="25%">
            <el-input v-model="courescontent.details" autocomplete="off" style="width: 90%" type="textarea"></el-input>
          </el-form-item>
        </el-form>
        <div   class="container">
          <el-button type="info" @click="courseVisible = false">取 消</el-button>
          <el-button type="primary" @click="savecourse()">确 定</el-button>
        </div>
      </el-dialog>
    </div>
  </div>
</template>
    
<script setup>
import { ref } from 'vue';
import {
  changeclass, delBatchclass, deleteclass, findclasss,
  findcourse, findquestionbanks, submitcourse, addcontract, findquestion, addBatchcontract
} from "@/api/index.js";
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
let conteact = ref({
  classid: 0,
  questionid: 0,
});
let dialogFormVisible = ref(false);
let courseVisible = ref(false);
let courescontent = ref({})
let form = ref({})
const options = ref([{
  value: '前端开发课程',
  label: '前端开发课程'
}, {
  value: 'Web开发',
  label: 'Web开发'
},
{
  value: 'Java编程课程',
  label: 'Java编程课程'
},
],);
function findBySearch() {
  findclasss(params.value).then(res => {
    if (res.code === '0') {
      tableData.value = res.data.list;
      console.log(tableData.value);
      total.value = res.data.total;
      console.log(total.value);
    } else {
      window.$message({
        message: res.msg,
        type: 'error'
      });
    }
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
  form.value.classid = classid;
  form.value.questionid = id;
  addcontract(form.value).then(res => {
    if (res.code === '0') {
      console.log(res.data);
      if (res.data == 1) {
        window.$message({
          message: '添加成功',
          type: 'success'
        });
      }
      else {
        window.$message({
          message: '早已添加',
          type: 'success'
        });
      }
    } else {
      window.$message({
        message: res.msg,
        type: 'error'
      });
    }
  })
}
function searchcourse(id) {
  params.value.classid = id;
  findcourse(params.value).then(res => {
    if (res.code === '0') {
      if (res.data != null) {
        courescontent.value = res.data;
      }
      else {
        courescontent.value = {};
        courescontent.value.classid = id;
      }
      courseVisible.value = true;
    } else {
      window.$message({
        message: res.msg,
        type: 'error'
      });
    }
  })
}

function findquestions(id) {
  classid.value = id;
  findquestionbanks(params.value).then(res => {
    if (res.code === '0') {
      questiondata.value = res.data.list;
      total.value = res.data.total;
      tableVisible2.value = true;
      tableVisible.value = false;
    } else {
      window.$message({
        message: res.msg,
        type: 'error'
      });
    }
  })
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
function savecourse() {
  submitcourse(courescontent.value).then(res => {
    if (res.code === '0') {
      window.$message({
        message: '操作成功',
        type: 'success'
      });
      courseVisible.value = false;
    } else {
      window.$message({
        message: res.msg,
        type: 'success'
      });
    }
  })
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
function del(id) {
  deleteclass(id).then(res => {
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
  multiContracts.value = [];
  for (let i = 0; i < val.length; i++) {
    conteact.value = {}
    conteact.value.classid = classid;
    conteact.value.questionid = val[i].questionid;
    console.log(conteact.questionid);
    multiContracts.value.push(conteact.value);
  }
} 
function addBatch() {
  if (multiContracts.value.length === 0) {
    $message.warning("请勾选您要添加的项")
    return
  }
  console.log(multiContracts.value)
  addBatchcontract(multiContracts.value).then(res => {
    if (res.code === '0') {
      window.$message.success("批量添加成功")

    } else {
      window.$message.error(res.msg)
    }
  })
} function delBatch() {
  if (multipleSelection.value.length === 0) {
    window.$message.warning("请勾选您要删除的项")
    return
  }
  delBatchclass(multipleSelection.value).then(res => {
    if (res.code === '0') {
      window.$message.success("批量删除成功");
      findBySearch();
    } else {
      window.$message.error(res.msg)
    }
  })
} function successUpload(res) {
  form.value.img = res.data;
}
function successUploadpdf(res) {
  form.content = res.data;
}
function down(flag) {
  location.href = 'http://localhost:8080/api/files/' + flag
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