<template>
  <vue-form v-model="formData" :schema="schema" :ui-schema="uiSchema"></vue-form>
</template>

<script lang="ts" setup>
import VueForm from '@lljj/vue3-form-ant';
import {ref, onMounted, shallowRef, markRaw} from 'vue';
import { Testwidget } from '/@/components/Widget'

const formData = ref({});
const schema = ref({});
const uiSchema = ref({});
const componentRef = shallowRef(Testwidget);

const treeData = [
  {
    title: 'parent11111',
    value: 'parent1',
    children: [
      {
        title: 'parent 1-0',
        value: 'parent 1-0',
        children: [
          {
            title: 'my leaf',
            value: 'leaf1',
          },
          {
            title: 'your leaf',
            value: 'leaf2',
          },
        ],
      },
      {
        title: 'parent 1-1',
        value: 'parent 1-1',
      },
    ],
  },
]
onMounted(() => {
  schema.value = {
    title: '自定义Widget (显示代码查看demo)',
    type: 'object',
    required: ['inputText', 'numberEnumRadio'],
    properties: {
      inputText: {
        title: '可以配置全局组件名、或者异步组件函数，或者同步组件options等',
        type: 'string',
        default: JSON.stringify(treeData),
      },
      numberEnumRadio: {
        type: 'number',
        title: '通过组件名(重置为 Radio 渲染)',
        enum: [1, 2, 3],
        enumNames: ['Radio - 1', 'Radio - 2', 'Radio - 3'],
      },
    },
  };
  uiSchema.value = {
    numberEnumRadio: {
      'ui:widget': 'RadioWidget',
    },
    inputText: {
      // 配置组件构造函数或者直接配置全局组件名，比如 'el-input'
      'ui:widget': componentRef,
    },
  };
});
</script>
