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
      <el-button type="primary" style="margin-left: 10px" @click="add()">新增</el-button>
      <el-popconfirm title="确定删除这些数据吗？" @confirm="delBatch()" v-if="props.msg !== 'A'">
        <template #reference>
          <el-button type="danger" style="margin-left: 5px">批量删除</el-button>
        </template>
      </el-popconfirm>
    </div>
    <div>
      <el-table :data="tableData" style="width: 100%; margin: 15px 0px" ref="table"
        @selection-change="handleSelectionChange" :row-key="getRowKeys">
        <el-table-column v-if="props.msg !== 'A'" ref="table" type="selection" width="55"
          :reserve-selection="true"></el-table-column>
        <el-table-column prop="questionid" label="题号" width="55px"></el-table-column>

        <el-table-column prop="name" label="题目名称" width="85px"></el-table-column>
        <el-table-column prop="type" label="题目类型" width="85px"></el-table-column>

        <el-table-column prop="description" label="题目描述"></el-table-column>
        <el-table-column prop="creator" label="创建者" width="75px"></el-table-column>
        <el-table-column label="提交数/正确数" width="75px">

          <template #default="{ row }">
            <span>{{ row.submitnum }} / {{ row.solvenum }}</span>
          </template>
        </el-table-column>
        <el-table-column prop="createtime" label="创建时间" width="165px"></el-table-column>
        <el-table-column label="操作">

          <template #default="{ row }">
            <span class="button-group">
              <el-button type="primary" @click="edit(row)">编辑</el-button>
              <el-button slot="reference" type="primary" @click="show(row.questionid)">查看</el-button>
              <el-popconfirm v-if="delshow(row.creator)" title="确定删除吗？" @confirm="del(row.id, row.questionid)">
                <template #reference>
                  <el-button type="danger" style="margin-left: 5px">删除</el-button>
                </template>
              </el-popconfirm>
            </span>
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
            <el-select v-model="form.type" clearable placeholder="请选择题目类型" style="width: 90%">
              <el-option v-for="item in options" :key="item.value" :label="item.label" :value="item.value">
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="题目创建者" label-width="25%">
            <el-input v-model="form.creator" readonly autocomplete="off" style="width: 90%"></el-input>
          </el-form-item>
          <el-form-item label="题目描述" label-width="25%">
            <el-input v-model="form.description" autocomplete="off" style="width: 90%"></el-input>
          </el-form-item>
          <el-form-item label="所属作业" label-width="25%">
            <el-input v-model="form.belongid" autocomplete="off" style="width: 90%"></el-input>
          </el-form-item>
          <span class="centered-text">请输入作业号，形式如[1,2],若无所属作业输入[]</span>
        </el-form>
        <div class="container">
          <el-button type="info" @click="dialogFormVisible = false">取 消</el-button>
          <el-button type="primary" @click="submit()">确 定</el-button>
        </div>
      </el-dialog>
      <el-dialog title="题目内容" v-model="contentVisible" width="50%">
        <el-form :model="form" class="multiline-text">
          <el-dialog v-model="innerVisible" width="40%" title="题解" append-to-body>

            <el-input v-model="form.answer" :autosize="{ minRows: 16, maxRows: 16 }" type="textarea" />

          </el-dialog>
          <el-form-item label="题目描述" label-width="25%">
            <el-input v-model="form.content" autocomplete="off" style="width: 90%" type="textarea"></el-input>
          </el-form-item>
          <el-form-item label="题目条件" label-width="25%">
            <label>时间限制:</label>
            <el-input v-model="judgeConfig.timeLimit" autocomplete="off" style="width: 15%"></el-input>

            <label>内存限制:</label>
            <el-input v-model="judgeConfig.memoryLimit" autocomplete="off" style="width: 15%"></el-input>

            <label>堆栈限制:</label>
            <el-input v-model="judgeConfig.stackLimit" autocomplete="off" style="width:15%"></el-input>
            <span class="centered-text">时间限制单位为ms,内存和堆栈限制单位为KB</span>

          </el-form-item>

          <el-form-item label="输入要求" label-width="25%">
            <el-input v-model="form.input" autocomplete="off" style="width: 90%" type="textarea"></el-input>
          </el-form-item>
          <el-form-item label="输出要求" label-width="25%">
            <el-input v-model="form.output" autocomplete="off" style="width: 90%" type="textarea"></el-input>
          </el-form-item>

          <el-form-item v-for="(judgeCaseItem, index) of JudgeCase" :key="index">
            <el-space direction="vertical" style="min-width: 640px">
              <el-form-item :prop="`form.judgeCase[${index}].input`" :label="`输入用例-${index}`" :key="index">
                <el-input v-model="judgeCaseItem.input" placeholder="请输入测试输入用例"></el-input>
              </el-form-item>
              <el-form-item :prop="`form.judgeCase[${index}].output`" :label="`输出用例-${index}`" :key="index">
                <el-input v-model="judgeCaseItem.output" placeholder="请输入测试输出用例"></el-input>
              </el-form-item>
              <el-row>
                <el-button @click="ShowAnswer" type="primary">查看题解</el-button>
                <el-button @click="handleAdd" type="primary">新增测试用例</el-button>
                <el-button type="danger" @click="handleDelete(index)">删除</el-button>

              </el-row>

            </el-space>
          </el-form-item>

        </el-form>

        <div class="container">
          <el-button type="info" @click="contentVisible = false">取 消</el-button>
          <el-button type="primary" @click="savecontent()">确 定</el-button>
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
  addquestion,
  changequestion,
  changequestionbank, delBatchquestion,
  delBatchquestionbank,
  deletequestion,
  deletequestionbank,
  findquestion,
  findquestionbanks
} from "@/api/index.js";
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
let contentVisible = ref(false);
let innerVisible = ref(false);
let judgeConfig = ref({
  timeLimit: "",
  memoryLimit: "",
  stackLimit: "",
})
let JudgeCase = ref([])
let multipleSelection = ref([]);
let selectedquestionid = ref([]);
let form = ref({
})
let list = ref({})
const user = ref(localStorage.getItem("user") ? JSON.parse(localStorage.getItem("user")) : {})
function ShowAnswer() {
  innerVisible.value = true;
}
function delshow(creator) {
  if (props.msg !== 'A') {
    return true;
  }
  else {
    if (creator === user.value.name) {
      console.log("判断成功");
      return true;
    }
    else {
      console.log("判断失败");
      return false;
    }
  }

}
function findBySearch() {
  findquestionbanks(params.value).then(res => {

    tableData.value = res.data.list;
    total.value = res.data.total;

  })
}
findBySearch();
function handleAdd() {
  JudgeCase.value.push({
    input: "",
    output: "",
  });

}
const handleDelete = (index) => {
  JudgeCase.value.splice(index, 1);
};

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
    creator: user.value.name,
    belongid: '[]'
  };
  dialogFormVisible.value = true;
}
function edit(obj) {
  form.value = obj;
  dialogFormVisible.value = true;
}
function show(id) {
  form.value = {}
  params.value.questionid = id;
  findquestion(params.value).then(res => {

    JudgeCase.value = []
    form.value = res.data;
    let str = form.value.judgeConfig;
    // 将字符串转换为JSON对象
    const json = JSON.parse(str);
    judgeConfig.value = json;
    let str2 = form.value.judgeCase;

    if (str2 == "[]") {
      JudgeCase.value.push({
        input: "",
        output: "",
      });
    }
    else {
      let json2 = JSON.parse(str2);
      JudgeCase.value = json2;
    }

    console.log(JudgeCase)
    contentVisible.value = true;

  })
  params.value = {
    pageNum: 1,
    pageSize: 5,
    name: '',
    phone: ''
  }
}
function submit() {
  changequestionbank(form.value).then(res => {
    if (res) {
      dialogFormVisible.value = false;
      findBySearch();
      window.$message({
        message: '操作成功',
        type: 'success'
      });
    }
  })
  list.value = {}
  list.value.id = form.value.questionid;
  list.value.judgeConfig = JSON.stringify(judgeConfig.value);
  list.value.judgeCase = JSON.stringify([{ "input": "", "output": "" }]);
  if (form.value.id === undefined) {
    addquestion(list.value).then(
      res => {
        window.$message({
          message: '操作成功',
          type: 'success'
        });
      }
    )
  }

}
function savecontent() {

  const jsonString = JSON.stringify(judgeConfig.value);
  form.value.judgeConfig = jsonString.toString();
  const jsonString2 = JSON.stringify(JudgeCase.value);
  form.value.judgeCase = jsonString2.toString();
  changequestion(form.value).then(res => {
    if (res) {
      window.$message({
        message: '操作成功',
        type: 'success'
      });
      contentVisible.value = false;
    }



  })
}
function del(id, questionid) {
  deletequestionbank(id).then(res => {
    if (res) {
      findBySearch();
    }
  })
  deletequestion(questionid).then(res => {
    if (res) {
      window.$message({
        message: '删除成功',
        type: 'success'
      });
    }
  })
}
function handleSelectionChange(val) {
  multipleSelection.value = val;
  selectedquestionid.value = [];
  for (let i = 0; i < val.length; i++) {
    console.log(val[i].questionid);
    params.value.questionid = val[i].questionid;

    findquestion(params.value).then(res => {

      selectedquestionid.value.push(res.data);

    })
  }
}
function delBatch() {
  if (multipleSelection.value.length === 0) {
    window.$message.warning("请勾选您要删除的项")
    return
  }
  console.log(multipleSelection.value);
  console.log('questionid');
  console.log(selectedquestionid.value);
  delBatchquestionbank(multipleSelection.value).then(res => {
    if (res) {
      window.$message.success("批量删除成功")
      findBySearch()
    }


  })
  delBatchquestion(selectedquestionid.value).then(res => {
    if (res) {
      window.$message.success("批量删除成功")
    }
  })
}
function getRowKeys(row) {
  return row.id;
}
</script>

<style>
.multiline-text {
  white-space: pre-line;
}

.button-group {
  display: flex;
}

.button-group>* {
  margin-right: 5px;
}
</style>