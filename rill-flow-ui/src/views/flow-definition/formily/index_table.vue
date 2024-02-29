<template>
  <FormProvider :form="form">
    <FormLayout :label-col="6" :wrapper-col="10">
      <SchemaField :schema="schema" :scope="{ formCollapse }" />
      <FormButtonGroup align-form-item>
        <Button
          @click="
            () => {
              form.query('tab3').take((field) => {
                field.visible = !field.visible
              })
            }
          "
        >
          显示/隐藏最后一个Tab
        </Button>
        <Button
          @click="
            () => {
              formCollapse.toggleActiveKey('tab2')
            }
          "
        >
          切换第二个Tab
        </Button>
        <Submit @submit="log">提交</Submit>
      </FormButtonGroup>
    </FormLayout>
  </FormProvider>
</template>

<script lang="ts">
/* eslint-disable vue/no-reserved-component-names */
import { createForm } from '@formily/core'
import { FormProvider, createSchemaField } from '@formily/vue'
import {
  FormItem,
  FormCollapse,
  FormButtonGroup,
  Form,
  FormLayout,
  Submit,
  Input,
  InputNumber
} from '@formily/antdv-x3'
import { Button } from 'ant-design-vue'

const { SchemaField } = createSchemaField({
  components: {
    FormItem,
    FormCollapse,
    Input,
    InputNumber,
  },
})

const schema = {
  type: 'object',
  properties: {
    collapse: {
      type: 'void',
      title: '折叠面板',
      'x-decorator': 'FormItem',
      'x-component': 'FormCollapse',
      'x-component-props': {
        formCollapse: '{{formCollapse}}',
      },
      properties: {
        retry: {
          type: 'void',
          'x-component': 'FormCollapse.CollapsePanel',
          'x-component-props': {
            header: '任务重试设置',
          },
          properties: {
            max_retry_times: {
              type: 'string',
              title: '最大重试次数',
              'x-decorator': 'FormItem',
              required: true,
              'x-component': 'InputNumber',
            },
            interval_in_seconds: {
              type: 'string',
              title: '间隔时间',
              'x-decorator': 'FormItem',
              required: true,
              'x-component': 'InputNumber',
            },
            multiplier: {
              type: 'string',
              title: '放大系数',
              'x-decorator': 'FormItem',
              required: true,
              'x-component': 'InputNumber',
            },
          },
        },
      },
    },
  },
}

export default {
  components: {
    FormButtonGroup,
    Button,
    Submit,
    SchemaField,
    FormProvider,
    FormLayout,
  },

  data() {
    const form = createForm()
    const formCollapse = FormCollapse.createFormCollapse()

    return {
      schema,
      form,
      formCollapse,
    }
  },
  methods: {
    log(values) {
      console.log(values)
    },
  },
}
</script>

<style lang="scss" scoped></style>
