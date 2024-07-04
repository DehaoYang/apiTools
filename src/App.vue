<script setup lang="ts">

import { onMounted } from 'vue';

onMounted(() => {
    addEventListener("keydown", (event) => {
        if (event.ctrlKey && event.key == "s") {
            event.preventDefault()
        }
        if (event.altKey && event.key == "t") {
            event.preventDefault()
        }
    })
})
</script>

<template>
    <div class="main">
        <router-view />
    </div>

</template>

<style scoped lang="scss">
.main{
    height: 100%;
    width: 100%;
}
</style>
