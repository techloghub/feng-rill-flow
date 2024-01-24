<template>
   <div>
<!--     test-widget {{modelValue}}  == {{value}} == {{treeData}}-->
     <a-tree-select
       v-model:value="value"
       show-search
       style="width: 100%"
       :dropdown-style="{ maxHeight: '400px', overflow: 'auto' }"
       placeholder="Please select"
       allow-clear
       tree-default-expand-all
       :tree-data="treeData"
       :field-names="{
        children: 'children',
        value: 'value',
        label: 'title',
      }"
       tree-node-filter-prop="title"
       @change="handleChange"
     >
       <template #suffixIcon><SmileOutlined /></template>
     </a-tree-select>
   </div>
</template>

<script lang="ts" setup>

import {defineProps, watch, ref, defineEmits} from 'vue'
const value = ref<string>();

const props = defineProps({
  value: {
    type: String,
  },
  modelValue: {
    type: String,
  },
  fieldProps: {

  },
  treeData: {

  }
});

// const treeData = [{"title":"parent11111","value":"parent1","children":[{"title":"parent 1-0","value":"parent 1-0","children":[{"title":"my leaf","value":"leaf1"},{"title":"your leaf","value":"leaf2"}]},{"title":"parent 1-1","value":"parent 1-1"}]}]
// const treeData = JSON.parse(props.modelValue)
const emit = defineEmits(['update:modelValue'])

function handleChange (e: string) {
  console.log("handleChange:", e)
  emit('update:modelValue', e)
  console.log("modelValue fieldProps", props.modelValue, props.fieldProps)
}


</script>

<style scoped>

</style>
