<template>
  <vue-form
    v-model="formData"
    :schema="schema"
    :formProps="formProps"
  />
</template>

<script lang="ts" setup>
import VueForm from '@lljj/vue3-form-ant';
import { ref } from 'vue';
import { TreeSelectWidget } from '@/components/Widget';

const formProps = ref();
formProps.value = {
  labelPosition: 'right',
  labelSuffix: '：',
};
const formData = {
  case3: {
    ruleList: [
      {
        attr: 'league',
        relation: '>',
        league: 'b',
      },
    ],
  },
};

const schema = {
  title: '使用ui-schema配置ui:hidden表达式',
  type: 'object',
  properties: {
    case3: {
      title: '列表/显示不同组件',
      type: 'object',
      properties: {
        ruleList: {
          title: '球员筛选',
          type: 'array',
          items: {
            type: 'object',
            properties: {
              attr: {
                title: '标准',
                type: 'string',
                enum: ['goal', 'league'],
                enumNames: ['入球数', '所在联盟'],
                'ui:width': '40%',
              },
              goal: {
                title: '入球数',
                type: 'string',
                // pattern: '^[0-9]+$',
                // message: {
                //   pattern: '输入正确得分'
                // },
                // default: JSON.stringify([{"title":"parent11111","value":"parent1","children":[{"title":"parent 1-0","value":"parent 1-0","children":[{"title":"my leaf","value":"leaf1"},{"title":"your leaf","value":"leaf2"}]},{"title":"parent 1-1","value":"parent 1-1"}]}]),
                'ui:hidden': "{{parentFormData.attr !== 'goal'}}",
                'ui:width': '40%',
                'ui:widget': TreeSelectWidget,
              },
              league: {
                title: '名称',
                type: 'string',
                enum: ['a', 'b', 'c'],
                enumNames: ['西甲', '英超', '中超'],
                'ui:hidden': "{{parentFormData.attr !== 'league'}}",
                'ui:width': '40%',
              },
            },
          },
        },
      },
    },
  },
};
</script>
