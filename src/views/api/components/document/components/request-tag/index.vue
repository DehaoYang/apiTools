<template>
    <span :class="['main-font',tagStyle[props.type]]">{{props.type}}</span>
</template>

<script setup lang="ts">
import { ref } from 'vue';

const props = defineProps({
    type: {
        type: String,
        default: 'POST'
    }
})
interface tagType {
    [key: string]: string
}
const tagStyle = ref<tagType>({
    POST: 'post-style',
    GET: 'get-style'
})
</script>

<style scoped lang="scss">
.main-font {
    display: block;
    width: 50px;
    font-size: 12px;
    font-weight: bolder;
    text-align: center;
    padding: 3px;
    color: #ffffff;
    border-radius: 4px;
}

.post-style {
    background-color: #ed8936;
}

.get-style {
    background-color: #40b480;
}
</style>