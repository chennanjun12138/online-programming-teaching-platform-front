<template>
        <div>
            <MdEditor :value="mdValue" :handle-change="onMdChange" />
        </div>
</template>
    
<script setup>
import { ref } from 'vue';
import { } from "@/api/index.js";
import MdEditor from "@/components/MdEditor.vue";
const mdValue = ref('');
const onMdChange = (v) => {
    mdValue.value = v;
  };
</script>
    
<style>
    
</style>