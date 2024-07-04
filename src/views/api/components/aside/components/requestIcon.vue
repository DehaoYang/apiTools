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
    width: 36px;
    font-size: 10px;
    font-weight: bolder;
    user-select: none;
}

.post-style {
    color: #ed8936;
}

.get-style {
    color: #40b480;
}
</style>