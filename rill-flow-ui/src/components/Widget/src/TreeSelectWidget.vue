<template>
  <div>
    <a-tree-select
      v-model:value="treeDataModel"
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
  import { defineProps, ref, defineEmits } from 'vue';

  const treeDataModel = ref<string>();

  const props = defineProps({
    value: {
      type: String,
    },
    modelValue: {
      type: String,
    },
    fieldProps: {},
    treeData: {},
  });

  treeDataModel.value = props.modelValue;

  const emit = defineEmits(['update:modelValue']);

  function handleChange(e: string) {
    console.log('TreeSelectWidget handleChange:', e);
    emit('update:modelValue', e);
    console.log('TreeSelectWidget modelValue fieldProps', props.modelValue, props.fieldProps, treeDataModel.value);
  }
</script>

<style scoped></style>
