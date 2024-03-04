<template>
  <BasicModal
    v-bind="$attrs"
    destroyOnClose
    @register="register"
    title="编辑"
    width="70%"
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
  import {getInputSchema} from "@/components/Dag/src/components/ToolBar/data";

  const form = ref();
  form.value = createForm();

  const schema = ref({});
  schema.value = {
    'type': 'object',
    'properties': getInputSchema()
  }
  const {SchemaField} = createSchemaField({
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
    }),
    provideGraph = useProvideGraph(), {dagMeta} = storeToRefs(provideGraph), {setDagMetaInputSchema} = provideGraph, [register, {closeModal}] = useModalInner((data) => {
      console.log('dagMeta====>', dagMeta.value.inputSchema, form.value.getFormState().values, data, JSON.parse(dagMeta.value.inputSchema));
      form.value.setFormState((state) => {
        state.values['inputSchema'] = JSON.parse(dagMeta.value.inputSchema);
      })
    }), handleOk = () => {
      setDagMetaInputSchema(form.value.getFormState().values.inputSchema);
      closeModal();
    };


</script>
