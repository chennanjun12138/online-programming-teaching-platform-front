<template>
    <div class='class-detail'>


        <el-card class="multiline-text">
            <p class="uppercase-text">题目名称：{{ Qdata.name }}</p>
            <p class="uppercase-text">题目描述：</p>
            <p class="lowercase-text">{{ questiondata.content }}</p>
            <p class="lowercase-text">题目条件：{{ questiondata.tiaojian }}</p>

            <p class="uppercase-text">Input:</p>
            <p class="lowercase-text">{{ questiondata.input }}</p>
            <p class="uppercase-text">Output</p>
            <p class="lowercase-text">{{ questiondata.output }}</p>
            <p class="uppercase-text">Sample Input</p>
            <p class="lowercase-text">{{ questiondata.examplein }}</p>
            <p class="uppercase-text">Sample Output</p>
            <p class="lowercase-text">{{ questiondata.exampleout }}</p>
        </el-card>

        <div style="width:50%">
            <el-row>
                编程语言：
                <el-select @change="onChangeEditorLang" v-model="language" placeholder="请选择" style="width: 200px;">
                    <el-option v-for="item in options" :key="item.value" :label="item.label" :value="item.value">
                    </el-option>
                </el-select>
            </el-row>

            <div class='monaco-editor'>
            </div>
            <el-button style="margin-top: 10px" type="warning" @click="runCode">提交代码</el-button>

        </div>

    </div>
</template>
    
<script setup>
import { ref, onMounted } from 'vue';
import { findbyid, findquestion } from "@/api/index.js";
import * as monaco from "monaco-editor";
import { useRouter, RouterLink } from "vue-router";
let router = useRouter()
let params = ref({
    name: '',
    phone: '',
    role: '',
    pageNum: 1,
    pageSize: 5,
    questionid: '',
    content: ''
})

let questiondata = ref([]);
 let Qdata = ref([]);
let language = ref("c");
let options = ref([
    {
        value: 'java',
        label: 'Java'
    },
    {
        value: 'c',
        label: 'C'
    },
    {
        value: 'javascript',
        label: 'Javascript'
    },
    {
        value: 'html',
        label: 'Html'
    },
    {
        value: 'json',
        label: 'Json'
    },
    {
        value: 'markdown',
        label: 'Markdown'
    },
    {
        value: 'sql',
        label: 'Sql'
    },
    {
        value: 'python',
        label: 'Python'
    },
    {
        value: 'xml',
        label: 'xml'
    },
])
findBySearch();
onMounted(async () => {
    await setupMonacoEditror();
});
function findBySearch() {
    params.value.questionid = router.currentRoute.value.params.questionid;
    // console.log(params.value.questionid);
    findquestion(params.value).then(res => {
        if (res.code === '0') {
           questiondata.value = res.data;
             console.log("题目数据");
            console.log(res.data);
        } else {
            window.$message({
                message: res.msg,
                type: 'error'
            });
        }
    })
    params.value.content = router.currentRoute.value.params.questionid;
    findbyid(params.value).then(res => {
        if (res.code === '0') {
            Qdata.value = res.data;
            console.log("题目名称");
            console.log(res.data);
        } else {
            window.$message({
                message: res.msg,
                type: 'error'
            });
        }
    })
}

function  setupMonacoEditror() {
    const container = document.querySelector('.monaco-editor')
    const monacoInstance = monaco.editor.create(container, {
        value: '',
        language: language.value,
        lineNumbers: 'on',
        theme: "vs-dark", // 主题
        minimap: {
            enabled: false
        }
    })
    monaco = monacoInstance
}
function onChangeEditorLang(lang) {
    monaco.updateOptions({
        language: lang
    })
    // 获取编辑器的值
    // console.log({
    //     language: language.value,
    //     code: monaco.getValue()
    // });
}
function handleSizeChange(pageSize) {
    params.value.pageSize = pageSize;
    findBySearch();
}
function handleCurrentChange(pageNum) {
    params.value.pageNum = pageNum;
    findBySearch();
}


</script>
    
<style>
.class-detail {
    display: flex;
    gap: 20px;
}

.monaco-editor {
    width: 100%;
    height: 400px;
    margin-top: 5px;
}

.uppercase-text {
    font-size: 24px;
    color: #000;
}

.lowercase-text {
    font-size: 16px;
    color: #000;
}

.multiline-text {
    width: 90%;
    white-space: pre-line;
}
</style>