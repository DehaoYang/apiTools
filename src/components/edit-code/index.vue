<template>
  <codemirror v-model="code" :style="{ height: '100%' }" :disabled="props.readOnly" :indent-with-tab="true"
              :tab-size="2" :extensions="extensions" @ready="handleReady" class="edit-code" @focus="focus"
              @blur="blur"/>
</template>
<script lang="ts" setup>
import {onMounted, ref, shallowRef, watch} from 'vue'
import {Codemirror} from 'vue-codemirror'
import {javascript} from '@codemirror/lang-javascript'
import {json} from '@codemirror/lang-json'
import {githubLight} from '@uiw/codemirror-theme-github';
import {clearSpace} from "@/utils/base/index"
import {js_beautify} from "js-beautify"
import {Extension} from '@codemirror/state';

const props = defineProps({
  text: {
    type: String,
    default: ""
  },
  lang: {
    type: String,
    default: 'json'
  },
  readOnly: {
    type: Boolean,
    default: false
  }
})
const emit = defineEmits(["changeText"]);
let code = ref('')
code.value = props.text ? js_beautify(props.text) : ""
watch(() => props.text, (val) => {
  if(val!==code.value){
    code.value = props.text ? js_beautify(val) : ""
  }

})
const extensions: Extension[] = [githubLight]
switch (props.lang) {
  case 'json':
    extensions.push(json())
    break
  case 'javascript':
    extensions.push(javascript())
    break
}
const view = shallowRef()
const handleReady = (payload: { view: any; }) => {
  view.value = payload.view
}
watch(code, (val) => {
  emit('changeText', JSON.parse(clearSpace(JSON.stringify(val))))
})
let isfocus = ref(false)
const focus = () => {
  isfocus.value = true
}
const blur = () => {
  isfocus.value = false
}
onMounted(() => {
  addEventListener("keydown", (event) => {
    if (event.ctrlKey && event.altKey && event.key == "l" && isfocus.value) {
      code.value = js_beautify(code.value)
    }
  })
})

</script>
<style lang="scss" scoped>
.edit-code {
  :deep(.cm-focused) {
    outline: 10px;
  }

  :deep(.cm-editor) {
    border: 1px solid rgba($color: #000000, $alpha: .2) !important;
  }
}
</style>