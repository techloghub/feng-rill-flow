<template>
  <BasicModal
    v-bind="$attrs"
    destroyOnClose
    @register="register"
    title="提交测试任务"
    width="40%"
    @ok="handleOk()"
  >
    <FormProvider :form="form">
      <SchemaField :schema="schema" />
    </FormProvider>
  </BasicModal>
</template>
<script lang="ts" setup>
  import { ref } from 'vue';
  import { BasicModal, useModalInner } from '/@/components/Modal';
  import { createForm } from '@formily/core';
  import { createSchemaField, FormProvider } from '@formily/vue';
  import {
    Form,
    FormItem,
    Space,
    Input,
    Select,
    DatePicker,
    ArrayItems,
    Switch,
    InputNumber,
    FormCollapse,
  } from '@formily/antdv-x3';
  import {useProvideGraph} from "@/components/Dag/src/store/graph";
  import {storeToRefs} from "pinia";

  const form = ref();
  form.value = createForm();

  const schema = ref({});
  schema.value = {
    "type": "object",
    "properties": {}
  }
  const { SchemaField } = createSchemaField({
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
  });

  const provideGraph = useProvideGraph();
  const { graphRef, dagMeta } = storeToRefs(provideGraph);
  const { setDagMetaInputSchema } = provideGraph;
  const executeDag = ref();

  const [register, { closeModal }] = useModalInner((data) => {
    console.log('DagTestRun dagMeta', data);
    executeDag.value = data.executeDagMethod;
    const inputSchema = dagMeta.value.inputSchema !== undefined ? JSON.parse(dagMeta.value.inputSchema) : [];

    inputSchema.forEach((item) => {
      console.log('buildSchema', item.paramsName, item, inputSchema);
      schema.value.properties[item.paramsName] = buildSchema(item);
    });

  });

  const handleOk = () => {
    //更新普通节点中的数据
    console.log('handleOk', dagMeta.value.id, form.value.getFormState().values, executeDag.value);

    executeDag.value({
        descriptor_id: dagMeta.value.id,
    },
      form.value.getFormState().values
    );
    closeModal();
  };

  function buildSchema(item) {
    if (item.paramsType === 'Number') {
      return {
        type: 'number',
        title: item.paramsName,
        'x-decorator': 'FormItem',
        'x-component': 'InputNumber',
        required: item.paramsRequired,
        'x-component-props': {
          style: {
            // width: '240px',
          },
        },
        "x-decorator-props": {
          tooltip: item.paramsDesc,
          wrapperAlign: 'right',
          labelAlign: 'left',
        },
      }
    } else if (item.paramsType === 'Boolean') {
      return {
        type: 'boolean',
        title: item.paramsName,
        'x-decorator': 'FormItem',
        'x-component': 'Switch',
        required: item.paramsRequired,
        'x-component-props': {
          style: {
            // width: '240px',
          },
        },
        "x-decorator-props": {
          tooltip: item.paramsDesc,
          wrapperAlign: 'right',
          labelAlign: 'left',
        },
      };
    } else if (item.paramsType === 'JSON') {
      return {
        type: 'string',
        title: '文本框',
        'x-decorator': 'FormItem',
        'x-component': 'Input.TextArea',
        'x-component-props': {
          style: {
            // width: 400,
          },
        },
        "x-decorator-props": {
          tooltip: item.paramsDesc,
          wrapperAlign: 'right',
          labelAlign: 'left',
        },
        required: true,
      }
    }
    return {
      type: 'string',
      title: item.paramsName,
      required: item.paramsRequired,
      'x-decorator': 'FormItem',
      'x-component': 'Input',
      "x-decorator-props": {
        tooltip: item.paramsDesc,
        wrapperAlign: 'right',
        labelAlign: 'left',
      },
    }
  }
</script>
