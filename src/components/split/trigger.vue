<template>
  <div :class="classes">
    <div :class="barConClasses"></div>
  </div>
</template>

<script setup lang="ts">
import { computed, ref } from "vue";

const props = defineProps({
  mode: String,
});
const prefix = "split-trigger";
const initOffset = ref(0);
const isVertical = computed(() => {
  return props.mode === "vertical";
});
const classes = computed(() => {
  return [
    prefix,
    isVertical.value ? `${prefix}-vertical` : `${prefix}-horizontal`,
  ];
});
const barConClasses = computed(() => {
  return [`${prefix}-bar-con`, isVertical.value ? "vertical" : "horizontal"];
});
</script>
