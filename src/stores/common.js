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