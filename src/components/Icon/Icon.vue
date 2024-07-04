<template>
  <svg aria-hidden="true" class="svg-icon" :style="styleObj">
    <use :xlink:href="symbolId" :fill="color" />
  </svg>
</template>

<script setup lang="ts">
import { computed } from "vue";

const props = defineProps({
  prefix: { type: String, default: "icon" },
  name: { type: String, required: true },
  color: { type: String, default: "" },
  size: { type: String, default: "30px" },
});

const symbolId = computed(() => `#${props.prefix}-${props.name}`);
const styleObj = computed(() => {
  return { height: props.size, width: props.size };
});
</script>

<style scoped></style>
