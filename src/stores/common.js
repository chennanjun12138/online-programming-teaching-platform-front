import { ref, computed } from 'vue'
import { defineStore } from 'pinia'
import { changeuser, findusers, deleteuser, delBatchuser } from "@/api/index.js";

export const usehandleSizeChange = defineStore('handleSizeChange', () => {
    function findBySearch() {
        findusers(params.value).then(res => {
            if (res.code === '0') {
                tableData.value = res.data.list;
                console.log(tableData);
                total.value = res.data.total;
            }  
        })
    }

    return{
        findBySearch
    }
})


export function getItem(key)
{
    if(localStorage.getItem(key))
    {
            return JSON.parse(localStorage.getItem(key));
    }
    else
    {
        return {}
    }
}



export function setItem(key,value)
{
    localStorage.setItem(key,value);
}
// <!--引入粒子特效的相关配置-->
export
const options = {
  fpsLimit: 60,
  interactivity: {
    detectsOn: 'canvas',
    events: {
      onClick: { // 开启鼠标点击的效果
        enable: true,
        mode: 'push'
      },
      onHover: { // 开启鼠标悬浮的效果(线条跟着鼠标移动)
        enable: true,
        mode: 'grab'
      },
      resize: true
    },
    modes: { // 配置动画效果
      bubble: {
        distance: 400,
        duration: 2,
        opacity: 0.8,
        size: 40
      },
      push: {
        quantity: 4
      },
      grab: {
        distance: 200,
        duration: 0.4
      },
      attract: { // 鼠标悬浮时，集中于一点，鼠标移开时释放产生涟漪效果
        distance: 200,
        duration: 0.4,
        factor: 5
      }
    }
  },
  particles: {
    color: {
      value: '#BA55D3' // 粒子点的颜色
    },
    links: {
      color: '#FFBBFF', // 线条颜色
      distance: 150,//线条距离
      enable: true,
      opacity: 0.4, // 不透明度
      width: 1.2 // 线条宽度
    },
    collisions: {
      enable: true
    },
    move: {
      attract: { enable: false, rotateX: 600, rotateY: 1200 },
      bounce: false,
      direction: 'none',
      enable: true,
      out_mode: 'out',
      random: false,
      speed: 0.5, // 移动速度
      straight: false
    },
    number: {
      density: {
        enable: true,
        value_area: 800
      },
      value: 80//粒子数
    },
    opacity: {//粒子透明度
      value: 0.7
    },
    shape: {//粒子样式
      type: 'star'
    },
    size: {//粒子大小
      random: true,
      value: 3
    }
  },
  detectRetina: true
}
 