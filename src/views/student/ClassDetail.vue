<template>
    <div class='class-detail'>

        <div style="width: 65% " class="show-container">
            <div style="margin-left: 10px;">
                <el-button type="warning" @click="goback()">返回</el-button>
            </div>
            <iframe ref="pdfIframe" @load="handleIframeLoad" id="pdf-iframe" class="ppt" :src="url"></iframe>
            <div style="display: flex; align-items: center;">
                <ul>
                    <li v-for="link in linklist">
                        <a :href="link">{{ link }}</a>
                    </li>
                </ul>
                <div style="margin-left: auto;">
                    <el-button type="warning" @click="gotoquestion">课后习题</el-button>
                </div>
            </div>
        </div>

        <div>


            <el-tabs v-model="activeName" @tab-click="handleClick">
                <el-tab-pane label="编辑器" name="first">
                    <el-row>
                        <el-text>编程语言：</el-text>
                        <el-select @change="onChangeEditorLang" v-model="language" placeholder="请选择" style="width: 200px;">
                            <el-option v-for="item in options" :key="item.value" :label="item.label" :value="item.value">
                            </el-option>
                        </el-select>
                        <el-button style="margin-left: 5px" type="warning" @click="runCode">运行</el-button>

                    </el-row>
                    <div class='monaco-editor'>
                    </div>
                </el-tab-pane>
                <el-tab-pane label="笔记本" name="second">

                    <div class="notebook">
                        <el-input v-model="textarea" :autosize="{ minRows: 16, maxRows: 16 }" type="textarea" />
                    </div>
                    <el-button style="margin-top: 10px;" type="warning" @click="savenote">保存</el-button>
                </el-tab-pane>
            </el-tabs>

            <el-dialog title="运行结果" v-model="runVisble">
                {{ runResult }}
            </el-dialog>
        </div>

    </div>
</template>
    
<script setup>
import { ref, onMounted, toRaw, } from 'vue';
import { downloadPDF, findcontract, runcode, savenotebook,findnotebook } from "@/api/index.js";
import * as monaco from "monaco-editor";
import { useRouter } from "vue-router";

const activeName = ref('first')
const textarea = ref('')
const handleClick = (tab, event) => {
    console.log(tab, event)
}
const router = useRouter()
const currentUrl = window.location.href;

let url = ref("")
let form = ref({})
let linklist = ref([]);
let qiddata = ref([]);
let language = ref("c")
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
        value: 'sql',
        label: 'Sql'
    },
    {
        value: 'python',
        label: 'Python'
    },
])
let params = ref({
    studentid:0,
    classid: 0,
    content: ''
})
const pdfIframe = ref(null);
let submitcontent = ref({});
const codemonaco = ref();
let runVisble = ref(false);
let runResult = ref('');
const user = ref(localStorage.getItem("user") ? JSON.parse(localStorage.getItem("user")) : {})

onMounted(async () => {
    await loadPDF(router.currentRoute.value.params.fileId)
    await pdfIframe.value;
    await setupMonacoEditror()
     
});
getnotebook()
function savenote() {
    form.value.classid = router.currentRoute.value.query.classId;
    form.value.studentid=user.value.id;
    form.value.content=textarea.value;
    savenotebook(form.value).then(
        res=>{
            if(res.code=='0')
            {
                window.$message({
                    message: "提交成功",
                    type: 'success'
                });
            }
        }
    )
}
function getnotebook()
{
       params.value.classid=router.currentRoute.value.query.classId;
       params.value.studentid=user.value.id;
       findnotebook(params.value).then(
        res=>{
            if(res.code=='0')
            {
                 console.log(res);
                 textarea.value=res.data.content;
            }
        }
    )
}
// loadPDF(router.currentRoute.value.params.fileId);
function handleIframeLoad() {
    const iframe = pdfIframe.value;
    const pdfWindow = iframe.contentWindow;
    const pdfViewer = pdfWindow.PDFViewerApplication;
    // 监听翻页事件
    pdfViewer.eventBus.on("pagechanging", (event) => {
        const currentPage = event.pageNumber;
        // console.log("当前页数：" + currentPage);
        linklist.value = []
        showquestion(currentPage);
    });
}
function showquestion(pagenumber) {
    const iframe = document.getElementById('pdf-iframe');
    if (iframe.contentWindow && iframe.contentWindow.PDFViewerApplication) {
        const pdfViewer = iframe.contentWindow.PDFViewerApplication;

        pdfViewer.pdfDocument.getPage(pagenumber).then(page => {
            page.getTextContent().then(content => {
                // console.log(pagenumber);
                const textItems = content.items.map(item => item.str);
                const pageText = textItems.join(' ');

                // 使用正则表达式查找包含 "http://localhost:7100/questioncontent/{数字}" 的字符串
                const regex = /questioncontent\/\d+/g;
                const matches = pageText.match(regex);

                // 如果找到匹配的子串
                if (matches) {
                    // console.log(matches);
                    const baseUrl = currentUrl.split('/').slice(0, 3).join('/');

                    linklist.value = matches.map(match => `${baseUrl}/${match}`);
                }
            });
        });
    }
}

function runCode() {
    submitcontent.value.userid = user.value.id;
    submitcontent.value.language = language.value;
    submitcontent.value.code = toRaw(codemonaco.value).getValue();
    runcode(submitcontent.value).then(
        res => {
            if (res.code === '0') {
                window.$message({
                    message: "提交成功",
                    type: 'success'
                });
                console.log(res.data);
                runResult.value = res.data;
                runVisble.value = true;
            } else {
                window.$message({
                    message: res.msg,
                    type: 'error'
                });
            }
        }
    )
}
function goback() {
    router.push("/classlearn");
}
function gotoquestion() {
    form.value.classid = router.currentRoute.value.query.classId;
    findcontract(form.value).then(res => {
        if (res.code === '0') {

            qiddata.value = res.data;
            // console.log(qiddata.value);
            if (qiddata.value.length === 0) {
                window.$message({
                    message: "该课程没有相关题目",
                    type: 'error'
                });
            }
            else {
                const randomIndex = Math.floor(Math.random() * qiddata.value.length);
                router.push(`/questioncontent/${qiddata.value[randomIndex].questionid}`)
            }

        } else {
            window.$message({
                message: res.msg,
                type: 'error'
            });
        }
    })

}
function loadPDF(fileId) {

    downloadPDF(fileId).then((res) => {

        let opurl = window.URL.createObjectURL(res);
        url.value = '/web/viewer.html?file=' + encodeURIComponent(opurl);
        console.log("最终地址：");
        console.log(url.value);
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
    monaco.editor.setModelLanguage(toRaw(codemonaco.value).getModel(), language.value); // 设置模型的语言

    // 获取编辑器的值
    console.log({
        language: language.value,
        code: toRaw(codemonaco.value).getValue()
    });

}

</script>
    
<style>
.show-container {
    display: flex;
    flex-direction: column;
    /* 设置垂直排列 */
    gap: 10px;
}

.ppt {

    width: 100%;
    /* 设置宽度 */
    height: 350px;
    /* 设置高度 */
    border: 1px solid #ccc;
    /* 设置边框样式 */
    margin: 10px;
    /* 设置外边距 */
    padding: 5px;
    /* 设置内边距 */
}

.class-detail {
    display: flex;
    gap: 20px;
}

.class-detail .monaco-editor {
    flex: 1;
    border: 1px solid;
    height: 400px;

}

.monaco-editor {
    width: 100%;
    height: 250px;
    margin-top: 5px;
}

.notebook {
    width: 300px;
    height: 350px;
    margin-top: 5px;
}

.ppt-container {
    flex: 1 0 100%;
    position: relative;
}
</style>