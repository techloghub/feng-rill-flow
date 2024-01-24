<template>
  <div class="content flex ">
    <div class="sider w-200">
      <VueForm
        v-model="formData"
        :schema="schema"
        :uiSchema="test"
        :error-schema="errorSchema"
        @on-submit="handleSubmit"
      >
      </VueForm>
    </div>
    <div class="sider w-200">
      schema
      <CodeEditor v-model:value="schema" :mode="modeValue"/>
    </div>
    <div class="sider w-200">
      formData
      <CodeEditor v-model:value="formData" :mode="modeValue"/>
    </div>
  </div>
</template>

<script lang="ts" setup>
import {CodeEditor, JsonPreview, MODE} from '/@/components/CodeEditor';
import { Button } from 'ant-design-vue';

import VueForm from '@lljj/vue3-form-ant';
import {h, ref} from 'vue'

const formData = ref({})
const errorSchema = {}
// const schema = {
//   title: '使用ui-schema配置ui:hidden表达式',
//   type: 'object',
//   properties: {
//     case1: {
//       title: '整体隐藏',
//       type: 'object',
//       properties: {
//         showMore: {
//           title: '显示更多',
//           type: 'boolean',
//           default: false
//         },
//         x1: {
//           title: '输入框1',
//           type: 'string',
//           'ui:hidden': '{{rootFormData.case1.showMore === false}}'
//         },
//         x2: {
//           title: '输入框2',
//           type: 'string',
//           'ui:hidden': '{{rootFormData.case1.showMore === false}}'
//         }
//       }
//     },
//     case3: {
//       title: '列表/显示不同组件',
//       type: 'object',
//       properties: {
//         ruleList: {
//           title: '球员筛选',
//           type: 'array',
//           items: {
//             type: 'object',
//             properties: {
//               attr: {
//                 title: '标准',
//                 type: 'string',
//                 enum: [
//                   'goal',
//                   'league'
//                 ],
//                 enumNames: [
//                   '入球数',
//                   '所在联盟'
//                 ],
//                 'ui:width': '40%'
//               },
//               relation: {
//                 title: '-',
//                 type: 'string',
//                 enum: [
//                   '>',
//                   '<',
//                   '='
//                 ],
//                 'ui:hidden': "{{parentFormData.attr === 'league'}}",
//                 'ui:width': '20%'
//               },
//               goal: {
//                 title: '入球数',
//                 type: 'string',
//                 pattern: '^[0-9]+$',
//                 message: {
//                   pattern: '输入正确得分'
//                 },
//                 'ui:hidden': "{{parentFormData.attr !== 'goal'}}",
//                 'ui:width': '40%'
//               },
//               league: {
//                 title: '名称',
//                 type: 'string',
//                 enum: [
//                   'a',
//                   'b',
//                   'c'
//                 ],
//                 enumNames: [
//                   '西甲',
//                   '英超',
//                   '中超'
//                 ],
//                 'ui:hidden': "{{parentFormData.attr !== 'league'}}",
//                 'ui:width': '40%'
//               }
//             }
//           }
//         }
//       }
//     }
//   }
// }
const test = {
  userInfo: {
    anyOfSelect: {
      'ui:widget': 'SelectWidget'
    },
    anyOf: [
      {
        'ui:title': '使用用户名设置（ui-schema）', // 这里会覆盖schema 配置
      },
    ]
  },
}
// const schema = {
//   type: 'object',
//   required: [
//     'userName',
//     'age',
//   ],
//   properties: {
//     userName: {
//       type: 'string',
//       title: '用户名',
//       default: 'Liu.Jun',
//       'ui:options': {
//         renderScopedSlots: {
//           default: (props) => h('span', "123")
//         }
//       }
//     },
//     age: {
//       type: 'number',
//       title: '年龄',
//       'ui:options': {
//         renderScopedSlots: {
//           append: (props) => h('span', "123")
//         }
//       }
//     },
//     bio: {
//       type: 'string',
//       title: '签名',
//       minLength: 10,
//       default: '知道的越多、就知道的越少',
//       'ui:options': {
//         placeholder: '请输入你的签名',
//         type: 'textarea',
//         rows: 1,
//         renderScopedSlots: {
//           default: (props) => h('span', "123")
//         }
//       }
//     }
//   }
// }


const schema = {
  title: '人员信息',
  type: 'object',
  properties: {
    selectWidgetOptions: {
      title: "Custom select widget with options",
      type: "string",
      enum: [
        "foo",
        "bar"
      ],
      enumNames: [
        "Foo",
        "Bar"
      ]
    },
    userInfo: {
      title: '个人资料设置方式',
      anyOf: [
        {
          title: '通过用户名设置',
          required: ['firstName'],
          properties: {
            type: {
              'ui:widget': 'HiddenWidget',
              title: '类型',
              type: 'string',
              default: 'userInfo',
              const: 'userInfo'
            },
            firstName: {
              type: 'string',
              title: '名字',
              default: 'Jun'
            },
            lastName: {
              type: 'string',
              title: '姓',
              default: 'Liu'
            }
          }
        },
        {
          title: '通过用户id设置',
          properties: {
            type: {
              'ui:widget': 'HiddenWidget',
              title: '类型',
              type: 'string',
              default: 'userId',
              const: 'userId'
            },
            idCode: {
              type: 'string',
              title: 'ID',
              default: '10086'
            }
          }
        }
      ]
    },
  },
}


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

function handleSubmit(formData) {
  console.log("vueform formData ", formData)
}
</script>
