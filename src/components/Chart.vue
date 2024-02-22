<template>
    <div class="chartclass">

        <div id="chart" style="width: 500px; height: 500px;"></div>
        <div id="chart2" style="width: 500px; height: 500px;"></div>


    </div>
</template>
    
<script setup>
import * as echarts from 'echarts/core';
import {
    TitleComponent,
    TooltipComponent,
    LegendComponent
} from 'echarts/components';
import { PieChart } from 'echarts/charts';
import { LabelLayout } from 'echarts/features';
import { CanvasRenderer } from 'echarts/renderers';
import { onMounted, watch, nextTick } from 'vue';

echarts.use([
    TitleComponent,
    TooltipComponent,
    LegendComponent,
    PieChart,
    CanvasRenderer,
    LabelLayout
]);
const props = defineProps({
    QuestionData: [],
    SubmitData: []
})
 
defineExpose({
    initPieChart
})
function initPieChart() {

    var chartDom = document.getElementById('chart');
    var myChart = echarts.init(chartDom);
    var chartDom2 = document.getElementById('chart2');
    var myChart2 = echarts.init(chartDom2);
    console.log(props.QuestionData)
    console.log(props.SubmitData)
    myChart.setOption(
        {
            title: {
                text: '做题情况',

                left: 'center'
            },
            tooltip: {
                trigger: 'item'
            },
            legend: {
                orient: 'vertical',
                left: 'left'
            },
            series: [
                {
                    name: '做题情况',
                    type: 'pie',
                    radius: '50%',
                    data: props.QuestionData,
                    emphasis: {
                        itemStyle: {
                            shadowBlur: 10,
                            shadowOffsetX: 0,
                            shadowColor: 'rgba(0, 0, 0, 0.5)'
                        }
                    }
                }
            ]
        }
    )
    myChart2.setOption(
        {
            title: {
                text: '提交结果',
                left: 'center'
            },
            tooltip: {
                trigger: 'item'
            },
            legend: {
                orient: 'vertical',
                left: 'left'
            },
            series: [
                {
                    name: '代码情况',
                    type: 'pie',
                    radius: '50%',
                    data: props.SubmitData,
                    emphasis: {
                        itemStyle: {
                            shadowBlur: 10,
                            shadowOffsetX: 0,
                            shadowColor: 'rgba(0, 0, 0, 0.5)'
                        }
                    }
                }
            ]
        }
    )
} 
watch(()=> [props.QuestionData,props.SubmitData ], () => {
 
    nextTick(()=> initPieChart())
}, {
    immediate: true,//一开始就执行
    deep: true,//深度监听：数组之类的
});

 

</script>
    
<style scoped>
.chartclass {
    display: flex;
    flex-direction: row;
    justify-content: space-around;


}
</style>