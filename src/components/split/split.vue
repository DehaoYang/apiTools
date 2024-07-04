<template>
  <div ref="outerWrapper" :class="wrapperClasses">
    <div v-if="isHorizontal" :class="`${state.prefix}-horizontal`">
      <div
        :style="{ right: `${anotherOffset}%` }"
        class="left-pane"
        :class="paneClasses"
      >
        <slot name="left" />
      </div>
      <div
        :class="`${state.prefix}-trigger-con`"
        :style="{ left: `${state.offset}%` }"
        @mousedown="handleMousedown"
      >
        <slot name="trigger">
          <Trigger mode="vertical" />
        </slot>
      </div>
      <div
        :style="{ left: `${state.offset}%` }"
        class="right-pane"
        :class="paneClasses"
      >
        <slot name="right" />
      </div>
    </div>
    <div v-else :class="`${state.prefix}-vertical`">
      <div
        :style="{ bottom: `${anotherOffset}%` }"
        class="top-pane"
        :class="paneClasses"
      >
        <slot name="top" />
      </div>
      <div
        :class="`${state.prefix}-trigger-con`"
        :style="{ top: `${state.offset}%` }"
        @mousedown="handleMousedown"
      >
        <slot name="trigger">
          <trigger mode="horizontal" />
        </slot>
      </div>
      <div
        :style="{ top: `${state.offset}%` }"
        class="bottom-pane"
        :class="paneClasses"
      >
        <slot name="bottom" />
      </div>
    </div>
  </div>
</template>
<script setup lang="ts">
import { computed, nextTick, onUnmounted, reactive, ref, watch } from "vue";
import { on, off } from "./dom.js";
import Trigger from "./trigger.vue";
import "./split.scss";

const props = defineProps({
  modelValue: {
    type: [Number, String],
    default: 0.5,
  },
  mode: {
    type: String,
    default: "horizontal",
  },
  min: {
    type: [Number, String],
    default: "40px",
  },
  max: {
    type: [Number, String],
    default: "40px",
  },
});
const emit = defineEmits([
  "update:modelValue",
  "on-move-start",
  "on-moving",
  "on-move-end",
]);

const state = reactive({
  prefix: "split",
  offset: 0,
  oldOffset: 0,
  isMoving: false,
  computedMin: 0,
  computedMax: 0,
  currentValue: 0.5,
  initOffset: 0,
});
const outerWrapper = ref("");
const wrapperClasses = computed(() => {
  return [`${state.prefix}-wrapper`, state.isMoving ? "no-select" : ""];
});
const paneClasses = computed(() => {
  return [
    `${state.prefix}-pane`,
    {
      [`${state.prefix}-pane-moving`]: state.isMoving,
    },
  ];
});
const isHorizontal = computed(() => {
  return props.mode === "horizontal";
});
const anotherOffset = computed(() => {
  return 100 - state.offset;
});
const valueIsPx = computed(() => {
  return typeof props.modelValue === "string";
});
const offsetSize = computed(() => {
  return isHorizontal.value ? "offsetWidth" : "offsetHeight";
});
const px2percent = (numerator: any, denominator: any) => {
  return parseFloat(numerator) / parseFloat(denominator);
};
function getComputedThresholdValue(type: string) {
  let size = outerWrapper.value[offsetSize.value];
  if (valueIsPx.value)
    return typeof props[type] === "string" ? props[type] : size * props[type];
  else
    return typeof props[type] === "string"
      ? px2percent(props[type], size)
      : props[type];
}
const getMin = (value1: any, value2: any) => {
  if (valueIsPx.value)
    return `${Math.min(parseFloat(value1), parseFloat(value2))}px`;
  else return Math.min(value1, value2);
};
const getMax = (value1: any, value2: any) => {
  if (valueIsPx.value)
    return `${Math.max(parseFloat(value1), parseFloat(value2))}px`;
  else return Math.max(value1, value2);
};
const getAnotherOffset = (value: any) => {
  let res: number | string = 0;
  if (valueIsPx.value)
    res = `${outerWrapper.value[offsetSize.value] - parseFloat(value)}px`;
  else res = 1 - value;
  return res;
};
const handleMove = (e: any) => {
  let pageOffset = isHorizontal.value ? e.pageX : e.pageY;
  let offset = pageOffset - state.initOffset;
  let outerWidth = outerWrapper.value[offsetSize.value];
  let value = valueIsPx.value
    ? `${parseFloat(state.oldOffset.toString()) + offset}px`
    : px2percent(outerWidth * state.oldOffset + offset, outerWidth);
  // console.log(value);
  let anotherValue = getAnotherOffset(value);
  if (parseFloat(value.toString()) <= parseFloat(state.computedMin.toString()))
    value = getMax(value, state.computedMin);
  if (
    parseFloat(anotherValue.toString()) <=
    parseFloat(state.computedMax.toString())
  )
    value = getAnotherOffset(getMax(anotherValue, state.computedMax));
  e.atMin = props.modelValue === state.computedMin;
  e.atMax = valueIsPx.value
    ? getAnotherOffset(props.modelValue) === state.computedMax
    : getAnotherOffset(props.modelValue) === state.computedMax;
  emit("update:modelValue", value);
  emit("on-moving", e);
};
const handleUp = () => {
  state.isMoving = false;
  off(document, "mousemove", handleMove);
  off(document, "mouseup", handleUp);
  emit("on-move-end");
};
const handleMousedown = (e: any) => {
  state.initOffset = isHorizontal.value ? e.pageX : e.pageY;
  state.oldOffset = Number(props.modelValue);
  state.isMoving = true;
  on(document, "mousemove", handleMove);
  on(document, "mouseup", handleUp);
  emit("on-move-start");
};
const computeOffset = () => {
  nextTick(() => {
    state.computedMin = getComputedThresholdValue("min");
    state.computedMax = getComputedThresholdValue("max");
    state.offset =
      ((valueIsPx.value
        ? px2percent(props.modelValue, outerWrapper.value[offsetSize.value])
        : Number(props.modelValue)) *
        10000) /
      100;
  });
};
watch(
  () => props.modelValue,
  (val) => {
    if (val !== state.currentValue) {
      state.currentValue = Number(val);
      computeOffset();
    }
  }
);
nextTick(() => {
  computeOffset();
});
on(window, "resize", computeOffset);
off(window, "resize", computeOffset);
</script>
