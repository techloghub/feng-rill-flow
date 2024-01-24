<template>
  <vue-form
    v-model="formData"
    :schema="schema"
    :ui-schema="uiSchema"
  >
  </vue-form>
</template>
<script>
// 实际场景这里可以是 import componentOptions from './widget-components/XXX.vue'
// 这里为了方便演示demo，直接通过render函数

import VueForm from '@lljj/vue3-form-ant';

const componentOptions = {
  name: 'TestAsyncWidget',
  props: {
    value: {
      type: null,
      default: ''
    }
  },
  render(h) {
    return h('div', {style: { padding: '4px', boxShadow: '0 0  4px 1px rgba(0,0,0,0.1)' }}, [
      h('button', {
        attrs: {type: 'button'},
        style: {marginRight: '6px'},
        on: {
          click: () => {
            this.$emit('input', String(new Date()))
          }
        }
      }, '点击更新时间'),
      h('span', this.value),
    ]);
  }
}

export default {
  components: [
    VueForm,
    componentOptions,
  ],
  data() {
    return {
      formData: {},
      schema: {
        title: '自定义Widget (显示代码查看demo)',
        type: 'object',
        required: ['inputText', 'numberEnumRadio'],
        properties: {
          inputText: {
            title: '可以配置全局组件名、或者异步组件函数，或者同步组件options等',
            type: 'string',
            default: String(new Date())
          },
          numberEnumRadio: {
            type: 'number',
            title: '通过组件名(重置为 Radio 渲染)',
            enum: [1, 2, 3],
            enumNames: ['Radio - 1', 'Radio - 2', 'Radio - 3']
          }
        }
      },
      uiSchema: {
        numberEnumRadio: {
          'ui:widget': 'RadioWidget'
        },
        inputText: {
          // 配置组件构造函数或者直接配置全局组件名，比如 'el-input'
          'ui:widget': componentOptions,
        }
      }
    }
  }
}
</script>
