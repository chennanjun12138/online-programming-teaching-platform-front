<template>
    <div class='class-detail'>


        <el-card class="multiline-text">
            <p class="uppercase-text">题目名称：{{ Qdata.name }}</p>
            <p class="uppercase-text">题目描述</p>
            <p class="lowercase-text">{{ questiondata.content }}</p>
            <p class="uppercase-text">题目条件</p>
            <p class="lowercase-text">时间限制:{{ judgeConfig.timeLimit }}ms&nbsp;&nbsp;
                内存限制:{{ judgeConfig.memoryLimit }}KB&nbsp;&nbsp;
                堆栈限制:{{ judgeConfig.stackLimit }}KB
            </p>
            <p class="uppercase-text">输入格式</p>
            <p class="lowercase-text">{{ questiondata.input }}</p>
            <p class="uppercase-text">输出格式</p>
            <p class="lowercase-text">{{ questiondata.output }}</p>
            <p class="uppercase-text">输入输出样例</p>

            <ul class="lowercase-text">
                <li v-for="(item, index) in JudgeCase" :key="index">

                    <div style="display: flex; align-items: center;">
                        <el-row :gutter="24">
                            <el-col :span="12" >
                                <h3>输入样例 #{{ index + 1 }}
                                    <el-button size="small" class="copy" @click="handleCopy(item.input)">复制</el-button>
                                </h3>
                                <code>{{ item.input }}</code>
                            </el-col>

                            <el-col :span="12" >
                                <h3>输出样例 #{{ index + 1 }}
                                    <el-button size="small" class="copy" @click="handleCopy(item.output)">复制</el-button>
                                </h3>
                                <code>{{ item.output }}</code>
                            </el-col>
                        </el-row>
                    </div>

                </li>
            </ul>


        </el-card>

        <div style="width:60%">
            <el-row>
                <div style="display: flex; align-items: center;">
                    <el-button type="primary" @click="goback" text :icon="ArrowLeft">返回</el-button>

                    <span style="width: 70px;">编程语言:</span>
                    <el-select @change="onChangeEditorLang()" v-model="language" placeholder="请选择"
                        style="width: 180px;">
                        <el-option v-for="item in options" :key="item.value" :label="item.label" :value="item.value">
                        </el-option>
                    </el-select>
                    <el-button key="查看题解" type="primary" text @click="ShowAnswer"> 查看题解 </el-button>

                </div>

            </el-row>

            <div class='monaco-editor'>
            </div>


            <!-- <el-button style="margin-top: 10px;background-color: transparent;" @click="showresult()">运行结果</el-button>
            <el-button style="margin-top: 10px;background-color: transparent; width: 60px;"
                @click="addinupt()">自测输入</el-button> -->
            <el-radio-group v-model="radio" style="margin-top: 10px;margin-right: 10px;">
                <el-radio-button label="运行结果" value="first" style="margin-top: 10px;background-color: transparent;"
                    @click="showresult()" />
                <el-radio-button label="自测输入" value="second" style="margin-top: 10px;background-color: transparent;"
                    @click="addinupt()" />

            </el-radio-group>
            <el-button class="custom_button" style="margin-top: 10px" @click="runCodebyme()"
                :icon="VideoPlay">自测运行</el-button>

            <el-button style="margin-top: 10px" type="primary" @click="runCode" :icon="Promotion">提交代码</el-button>
            <el-card v-show="cardVisble" style="margin-top: 10px">
                <span v-if="inputvisble">
                    自测用例:
                </span>
                <el-input v-if="inputvisble" v-model="submitcontent.inputcontent" autocomplete="off"
                    style="width: 100%;margin-top: 10px;" type="textarea"
                    :autosize="{ minRows: 2, maxRows: 15 }"></el-input>
                <span v-if="!inputvisble">
                    运行结果:
                    <p style="white-space: pre-wrap;">{{runResult}}</p>
                    
                </span>


            </el-card>
        </div>
        <el-dialog v-model="innerVisible" width="40%" title="题解" append-to-body>
            <div class='monaco-editor' style="border: 1px solid #ccc; padding: 10px;overflow: auto;">
                    <pre style="white-space: pre-wrap;">
                {{ questiondata.answer }}
            </pre>
        </div>
        </el-dialog>
    </div>
</template>

<script setup>

import { ref, onMounted, toRaw } from 'vue';
import { findbyid, findquestion, submitcode, runcode } from "@/api/index.js";
import { ArrowLeft, Promotion, VideoPlay } from "@element-plus/icons-vue"
import * as monaco from "monaco-editor";
import { useRouter } from "vue-router";

import Clipboard from 'clipboard'


let cardVisble = ref(false);
let runResult = ref(''); 
let inputvisble = ref(false)
const radio = ref('')
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
let innerVisible = ref(false);
let questiondata = ref([]);
let judgeConfig = ref({
    timeLimit: "",
    memoryLimit: "",
    stackLimit: "",
})
let JudgeCase = ref([])

let Qdata = ref([]);
let language = ref("c");
const codemonaco = ref();
const user = ref(localStorage.getItem("user") ? JSON.parse(localStorage.getItem("user")) : {})
let submitcontent = ref({});
let options = ref([
    {
        value: 'c',
        label: 'C'
    },
    {
        value: 'java',
        label: 'Java'
    },
    {
        value: 'javascript',
        label: 'Javascript'
    },
    {
        value: 'sql',
        label: 'Sql'
    },
    {
        value: 'python',
        label: 'Python'
    },
])

const handleCopy = async (content) => {

    let clipboard = new Clipboard('.copy', {
        text: function () {
            return content;
        }
    })
    await clipboard.on('success', (e) => {
        window.$message({
            message: "复制成功",
            type: 'success'
        }
        );

        console.log('复制成功', e)
        // 释放内存
        clipboard.destroy()
    })
    await clipboard.on('error', (e) => {
        // 不支持复制
        window.$message({
            message: "该浏览器不支持自动复制",
            type: 'error'
        }
        );
        console.log('该浏览器不支持自动复制', e)
        // 释放内存
        clipboard.destroy()
    })
}

findBySearch();
onMounted(async () => {
    await setupMonacoEditror();

});
function goback() {
    router.back();
}
function ShowAnswer() {
    innerVisible.value = true;
}
function addinupt() {
    inputvisble.value = true;
    cardVisble.value = true;
}

function showresult() {
    cardVisble.value = true;
    inputvisble.value = false;
}
function runCodebyme() {
    submitcontent.value.userid = user.value.id;
    submitcontent.value.language = language.value;
    submitcontent.value.code = toRaw(codemonaco.value).getValue();
    runResult.value='';
    runcode(submitcontent.value).then(
        res => {
            if (res) {
                window.$message({
                    message: "自测运行成功",
                    type: 'success'
                });
                console.log(res.data[0]);
                runResult.value = res.data[0];
                

            }
        }
    )
}
function runCode() {
    submitcontent.value.userid = user.value.id;
    submitcontent.value.questionid = router.currentRoute.value.params.questionid;
    submitcontent.value.language = language.value;
    submitcontent.value.code = toRaw(codemonaco.value).getValue();
    submitcontent.value.status = 0;
    if (!submitcontent.value.code) {
        return window.$message({
            message: "没有代码",
            type: 'error'
        });
    }

    submitcode(submitcontent.value).then(
        res => {
            if (res) {
                window.$message({
                    message: "提交成功",
                    type: 'success'
                });
                router.push("/code");
            }
        }
    )
}
function findBySearch() {
    params.value.questionid = router.currentRoute.value.params.questionid;
    // console.log(params.value.questionid);
    findquestion(params.value).then(res => {
        if (res) {
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
            // JudgeCaseinput.value = JudgeCase.value.map(item => item.input).join('\n');
            // JudgeCaseoutput.value = JudgeCase.value.map(item => item.output).join('\n')
        }
    })
    params.value.content = router.currentRoute.value.params.questionid;
    findbyid(params.value).then(res => {
        if (res) {
            Qdata.value = res.data;
            console.log("题目名称");
            console.log(res.data);
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
    monaco.editor.setModelLanguage(toRaw(codemonaco.value).getModel(), language.value); // 设置模型的语言
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
    display: flex;

    flex-wrap: wrap;
}

.multiline-text {
    width: 90%;
    white-space: pre-line;
}

.custom_button {
    background-color: #fff;
    /* 设置背景颜色为白色 */
    border: 1px solid #409EFF;
    /* 设置边框为蓝色 */
    color: #409EFF;
    /* 设置文字颜色为蓝色 */
}

.custom_button:hover {
    color: #fff;
    background-color: #0FB3B3 !important;
}
</style>