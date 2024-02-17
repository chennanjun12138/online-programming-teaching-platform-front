<template>
    <div class='class-detail'>


        <el-card class="multiline-text">
            <p class="uppercase-text">题目名称：{{ Qdata.name }}</p>
            <p class="uppercase-text">题目描述：</p>
            <p class="lowercase-text">{{ questiondata.content }}</p>
            <p class="uppercase-text">题目条件:</p>
            <p class="lowercase-text">时间限制:{{ judgeConfig.timeLimit }}ms&nbsp;&nbsp;
                内存限制:{{ judgeConfig.memoryLimit }}KB&nbsp;&nbsp;
                堆栈限制:{{ judgeConfig.stackLimit }}KB
            </p>



            <p class="uppercase-text">Input:</p>
            <p class="lowercase-text">{{ questiondata.input }}</p>
            <p class="uppercase-text">Output</p>
            <p class="lowercase-text">{{ questiondata.output }}</p>
            <p class="uppercase-text">Sample Input</p>
            <ul class="lowercase-text">
                <li v-for="item in JudgeCase" :key="item.input">
                    {{ item.input }}
                </li>
            </ul>
            <p class="uppercase-text">Sample Output</p>
            <ul class="lowercase-text">
                <li v-for="item in JudgeCase" :key="item.input">
                    {{ item.output }}
                </li>
            </ul>
        </el-card>

        <div style="width:60%">
            <el-row>
                编程语言：
                <el-select @change="onChangeEditorLang()" v-model="language" placeholder="请选择" style="width: 200px;">
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
import { ref, onMounted, toRaw } from 'vue';
import { findbyid, findquestion, submitcode } from "@/api/index.js";
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
let judgeConfig = ref({
    timeLimit: "",
    memoryLimit: "",
    stackLimit: "",
})
let JudgeCase = ref([])
let Qdata = ref([]);
let language = ref("java");
const codemonaco = ref();
const user = ref(localStorage.getItem("user") ? JSON.parse(localStorage.getItem("user")) : {})
let submitcontent = ref({});
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
function runCode() {
    submitcontent.value.userid = user.value.id;
    submitcontent.value.questionid = router.currentRoute.value.params.questionid;
    submitcontent.value.language = language.value;
    submitcontent.value.code = toRaw(codemonaco.value).getValue();
    submitcontent.value.status = 0;
    console.log(toRaw(codemonaco.value).getValue());
    submitcode(submitcontent.value).then(
        res => {
            if (res.code === '0') {
                window.$message({
                    message: "提交成功",
                    type: 'success'
                });

            } else {
                window.$message({
                    message: res.msg,
                    type: 'error'
                });
            }
        }
    )
}
function findBySearch() {
    params.value.questionid = router.currentRoute.value.params.questionid;
    // console.log(params.value.questionid);
    findquestion(params.value).then(res => {
        if (res.code === '0') {
            questiondata.value = res.data;
            let str = questiondata.value.judgeConfig;
            // 将字符串转换为JSON对象
            const json = JSON.parse(str);
            judgeConfig.value = json;
            let str2 = questiondata.value.judgeCase;
            // 将字符串转换为JSON对象
            console.log(str2);
            const json2 = JSON.parse(str2);
            JudgeCase.value = json2;
            console.log(JudgeCase);
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

function setupMonacoEditror() {
    const container = document.querySelector('.monaco-editor')
    codemonaco.value = monaco.editor.create(container, {
        value: '',
        language: language.value,
        lineNumbers: 'on',
        theme: "vs-dark", // 主题
        minimap: {
            enabled: false
        }
    })
    monaco = codemonaco.value
}
function onChangeEditorLang() {
    // var model = monaco.editor.getModel(); // 获取当前编辑器的模型
     monaco.editor.setModelLanguage( toRaw(codemonaco.value).getModel(), language.value); // 设置模型的语言
    // console.log(codemonaco.value.language)
    // 获取编辑器的值
    console.log({
        language: language.value,
        code: toRaw(codemonaco.value).getValue()
    });
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