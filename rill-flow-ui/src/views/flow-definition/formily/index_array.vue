<template>
  <FormProvider :form="form">
    <SchemaField :schema="schema" />
    <Submit @submit="log">提交</Submit>
  </FormProvider>
  <Switch v-model:checked="checked" />
</template>

<script lang="ts">
import { createForm } from '@formily/core'
import { FormProvider, createSchemaField } from '@formily/vue'
import {
  FormButtonGroup,
  Submit,
  FormItem,
  Space,
  Input,
  Select,
  DatePicker,
  ArrayItems,
  Switch,
} from '@formily/antdv-x3'
import { Button } from 'ant-design-vue'

const SchemaField = createSchemaField({
  components: {
    FormItem,
    Space,
    Input,
    Select,
    DatePicker,
    ArrayItems,
    Switch,
  },
})

export default {
  components: {
    FormProvider,
    Submit,
    ...SchemaField,
  },

  data() {
    const form = createForm()
    const schema = {
      type: 'object',
      properties: {
        input: {
          type: 'string',
          title: '输入框',
          'x-decorator': 'FormItem',
          'x-component': 'Input',
        },
        select: {
          type: 'string',
          title: '选择框',
          enum: [
            {
              label: '选项1',
              value: 1,
            },
            {
              label: '选项2',
              value: 2,
            },
          ],
          'x-decorator': 'FormItem',
          'x-component': 'Select',
          'x-component-props': {
            style: 'width: 240px;',
          },
        },
        switch: {
          type: 'boolean',
          title: '开关',
          'x-decorator': 'FormItem',
          'x-component': 'Switch',
        },
        string_array: {
          type: 'array',
          'x-component': 'ArrayItems',
          'x-decorator': 'FormItem',
          title: '字符串数组',
          items: {
            type: 'void',
            'x-component': 'Space',
            properties: {
              sort: {
                type: 'void',
                'x-decorator': 'FormItem',
                'x-component': 'ArrayItems.SortHandle',
              },
              input: {
                type: 'string',
                'x-decorator': 'FormItem',
                'x-component': 'Input',
              },
              remove: {
                type: 'void',
                'x-decorator': 'FormItem',
                'x-component': 'ArrayItems.Remove',
              },
            },
          },
          properties: {
            add: {
              type: 'void',
              title: '添加记录',
              'x-component': 'ArrayItems.Addition',
            },
          },
        },
        array: {
          type: 'array',
          'x-component': 'ArrayItems',
          'x-decorator': 'FormItem',
          title: '对象数组',
          items: {
            type: 'object',
            properties: {
              space: {
                type: 'void',
                'x-component': 'Space',
                properties: {
                  sort: {
                    type: 'void',
                    'x-decorator': 'FormItem',
                    'x-component': 'ArrayItems.SortHandle',
                  },
                  date: {
                    type: 'string',
                    title: '日期',
                    'x-decorator': 'FormItem',
                    'x-component': 'DatePicker',
                    'x-component-props': {
                      type: 'daterange',
                      style: {
                        width: '250px',
                      },
                    },
                  },
                  input: {
                    type: 'string',
                    title: '输入框',
                    'x-decorator': 'FormItem',
                    'x-component': 'Input',
                  },
                  select: {
                    type: 'string',
                    title: '下拉框',
                    enum: [
                      { label: '选项1', value: 1 },
                      { label: '选项2', value: 2 },
                    ],
                    'x-decorator': 'FormItem',
                    'x-component': 'Select',
                    'x-component-props': {
                      style: {
                        width: '250px',
                      },
                    },
                  },
                  remove: {
                    type: 'void',
                    'x-decorator': 'FormItem',
                    'x-component': 'ArrayItems.Remove',
                  },
                },
              },
            },
          },
          properties: {
            add: {
              type: 'void',
              title: '添加条目',
              'x-component': 'ArrayItems.Addition',
            },
          },
        },
      },
    }
    form.setFormState(state => {
      state.values =  {
        "input": "defaultValue1111",
        "string_array": [
          "11",
          "122",
          "133"
        ],
        "array": [
          {
            "date": "2024-01-01",
            "input": "1",
            "select": 1
          },
          {
            "date": "2024-01-03",
            "input": "2",
            "select": 2
          }
        ],
        "array2": [
          {
            "date": "2024-01-25",
            "input": "1"
          },
          {
            "date": "2024-01-27",
            "input": "1"
          }
        ],
        "select": 1,
        "switch": true
      };
    });
    const checked = true
    return {
      form,
      schema,
      checked
    }
  },
  methods: {
    log(values) {
      console.log("====>",values)
    },
  },
}
</script>

<style lang="scss" scoped></style>
