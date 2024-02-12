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
            <el-row>
                编程语言：
                <el-select @change="onChangeEditorLang" v-model="language" placeholder="请选择" style="width: 200px;">
                    <el-option v-for="item in options" :key="item.value" :label="item.label" :value="item.value">
                    </el-option>
                </el-select>
                <el-button style="margin-left: 5px" type="warning" @click="runCode">运行</el-button>

            </el-row>

            <div class='monaco-editor'>
            </div>

        </div>

    </div>
</template>
    
<script setup>
import { ref, onMounted } from 'vue';
import { downloadPDF, findcontract } from "@/api/index.js";
import * as monaco from "monaco-editor";
import MdEditor from "@/components/MdEditor.vue";
import { useRouter, RouterLink } from "vue-router";
const router = useRouter()
const currentUrl = window.location.href;
const mdValue = ref();
const onMdChange = (v) => {
    mdValue.value = v;
};

let url = ref("")
let form = ref({})
let linklist = ref([]);
let qiddata = ref([]);
let language = ref("c")
const options = ref([
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
],
)
const pdfIframe = ref(null);
onMounted(async () => {
    await loadPDF(router.currentRoute.value.params.fileId)
    await pdfIframe.value;
    await setupMonacoEditror()
});
// loadPDF(router.currentRoute.value.params.fileId);
function handleIframeLoad() {
    const iframe = pdfIframe.value;
    const pdfWindow = iframe.contentWindow;
    const pdfViewer = pdfWindow.PDFViewerApplication;
    // 监听翻页事件
    pdfViewer.eventBus.on("pagechanging", (event) => {
        const currentPage = event.pageNumber;
        console.log("当前页数：" + currentPage);
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
                console.log(pagenumber);
                const textItems = content.items.map(item => item.str);
                const pageText = textItems.join(' ');

                // 使用正则表达式查找包含 "http://localhost:7100/questioncontent/{数字}" 的字符串
                const regex = /questioncontent\/\d+/g;
                const matches = pageText.match(regex);

                // 如果找到匹配的子串
                if (matches) {
                    console.log(matches);
                    const baseUrl = currentUrl.split('/').slice(0, 3).join('/');

                    linklist.value = matches.map(match => `${baseUrl}/${match}`);
                }
            });
        });
    }
}

function runCode() {

}
function goback() {
    router.push("/classlearn");
}
function gotoquestion() {
    form.value.classid = router.currentRoute.value.query.classId;
    findcontract(form.value).then(res => {
        if (res.code === '0') {

            qiddata.value = res.data;
            console.log(qiddata.value);
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
    monaco.value.updateOptions({
        language: lang
    })
    // 获取编辑器的值
    console.log({
        language: language.value,
        code: monaco.value.getValue()
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

.ppt-container {
    flex: 1 0 100%;
    position: relative;
}
</style>