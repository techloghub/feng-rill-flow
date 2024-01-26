<template>
  <BasicModal
    v-bind="$attrs"
    title="节点编辑"
    :helpMessage="['提示1', '提示2']"
    @register="registerModal"
    @ok="handleOk()"
    width="60%"
  >

    <FormProvider :form="form">
      <SchemaField :schema="schema" :scope="{ formCollapse }" />
      <!--      <Submit @submit="handleOk">提交</Submit>-->
    </FormProvider>

  </BasicModal>

</template>
<script lang="ts">
import {createVNode, defineComponent, h, inject, onMounted, ref, Ref, shallowRef, toRaw} from "vue";
import {useI18n} from '@/hooks/web/useI18n';
import {BasicModal, useModalInner} from '@/components/Modal';

import { createForm } from '@formily/core'
import { FormProvider, createSchemaField } from '@formily/vue'
import {
  Submit,
  FormItem,
  Space,
  Input,
  Select,
  DatePicker,
  ArrayItems,
  Switch,
  InputNumber,
  FormCollapse,
} from '@formily/antdv-x3'
import {getJsonData, getJsonSchema} from "@/components/Dag/src/components/Graph/methods";


const SchemaField = createSchemaField({
  components: {
    FormItem,
    Space,
    Input,
    Select,
    DatePicker,
    ArrayItems,
    Switch,
    InputNumber,
    FormCollapse,
  },
})

export default defineComponent({
  components: {
    BasicModal,
    FormProvider,
    Submit,
    ...SchemaField,

  },
  setup() {
    const {t} = useI18n();
    const showNodeEditModal: any = inject('showNodeEditModal');
    const form = ref()
    form.value = createForm()
    const formCollapse = FormCollapse.createFormCollapse()

    const schema = ref()
    const schema1 = ref()
    schema.value = {
      type: 'object',
      properties: {}

    }
    schema1.value = {
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
    // form.value.setFormState(state => {
    //   state.values =  {
    //     "input": "defaultValue1111",
    //     "string_array": [
    //       "11",
    //       "122",
    //       "133"
    //     ],
    //     "array": [
    //       {
    //         "date": "2024-01-01",
    //         "input": "1",
    //         "select": 1
    //       },
    //       {
    //         "date": "2024-01-03",
    //         "input": "2",
    //         "select": 2
    //       }
    //     ],
    //     "array2": [
    //       {
    //         "date": "2024-01-25",
    //         "input": "1"
    //       },
    //       {
    //         "date": "2024-01-27",
    //         "input": "1"
    //       }
    //     ],
    //     "select": 1,
    //     "switch": true
    //   };
    // });

    // const getJsonSchema = (rule) => {
    //   console.log("rule:", rule)
    // }
    function camelToSnake(str) {
      return str.replace(/[A-Z]/g, (match) => "_" + match.toLowerCase());
    }

    function snakeToCamel(str) {
      return str.replace(/_([a-z])/g, (match, letter) => letter.toUpperCase());
    }

    const [registerModal, {closeModal}] = useModalInner((cell) => {
      console.log("useModalInner schemaInfo ", cell, cell.store.data.nodeDetailSchema.fields,cell.store.data.nodeDetailParams)

      const schemas = cell.store.data.nodeDetailSchema.fields
      const params = cell.store.data.nodeDetailParams.task
      console.log("useModalInner schemaInfo ", cell, cell.store.data.nodeDetailSchema.fields,cell.store.data.nodeDetailParams)

      for (const dataKey in schemas) {
        // console.log("useModalInner schemaInfo schemas", dataKey, schemas[dataKey], getJsonSchema(schemas[dataKey]))

        schema.value.properties[dataKey] = getJsonSchema(schemas[dataKey])

        form.value.setFormState(state => {
          state.values[dataKey] = getJsonData(params[snakeToCamel(dataKey)]);
        });
      }
    });



    const handleOk = () => {

      //更新普通节点中的数据
      console.log("handleOk", form.value.getFormState().values)

      // 更新form中的数据
      // for (const formSchema in formSchemas.value) {
      //   if (modelRef.value?.formModel[formSchemas.value[formSchema].field]) {
      //     formSchemas.value[formSchema].defaultValue = modelRef.value?.formModel[formSchemas.value[formSchema].field]
      //   }
      // }
      // 更新节点名称
      // const nodeDetailParams = toRaw(modelRef.value?.formModel)
      // cellRef.value.prop('label', modelRef.value?.formModel.name)
      // cellRef.value.prop('nodeDetailParams', nodeDetailParams)
      // console.log("=====> meta ", modelRef.value?.formModel, nodeDetailParams)

      closeModal();
      showNodeEditModal.value = false
    };

    return {
      showNodeEditModal,
      registerModal,
      handleOk,
      form,
      schema,
      formCollapse,
    }
  }
})


</script>
