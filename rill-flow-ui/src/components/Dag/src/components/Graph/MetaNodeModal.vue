<template>
  <BasicModal
    v-bind="$attrs"
    title="节点编辑"
    @register="registerModal"
    @ok="handleOk()"
    width="60%"
  >
    <FormProvider :form="form">
      <SchemaField :schema="schema" :scope="{ formCollapse }" />
    </FormProvider>
  </BasicModal>
</template>
<script lang="ts">
  import { defineComponent, inject, ref } from 'vue';
  import { BasicModal, useModalInner } from '@/components/Modal';

  import { createForm } from '@formily/core';
  import { FormProvider, createSchemaField } from '@formily/vue';
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
  } from '@formily/antdv-x3';
  import { getJsonData, getJsonSchema } from '@/components/Dag/src/components/Graph/methods';

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
  });

  export default defineComponent({
    components: {
      BasicModal,
      FormProvider,
      Submit,
      ...SchemaField,
    },
    setup() {
      const showNodeEditModal: any = inject('showNodeEditModal');
      const form = ref();
      form.value = createForm();
      const formCollapse = FormCollapse.createFormCollapse();

      const schema = ref();
      schema.value = {
        type: 'object',
        properties: {},
      };

      function camelToSnake(str) {
        return str.replace(/[A-Z]/g, (match) => '_' + match.toLowerCase());
      }

      function snakeToCamel(str) {
        return str.replace(/_([a-z])/g, (match, letter) => letter.toUpperCase());
      }
      const cellRef = new ref();

      const [registerModal, { closeModal }] = useModalInner((cell) => {
        console.log(
          'useModalInner schemaInfo ',
          cell,
          cell.store.data.nodeDetailSchema,
          cell.store.data.nodeDetailParams,
        );
        cellRef.value = cell;
        const schemas = cell.store.data.nodeDetailSchema.meta_data.fields;
        const params = cell.store.data.nodeDetailParams;

        console.log(
          'useModalInner schemaInfo ',
          cell,
          cell.store.data.nodeDetailSchema,
          cell.store.data.nodeDetailParams,
          schemas,
        );

        for (const dataKey in schemas) {
          console.log("===> dataKey", dataKey, snakeToCamel(dataKey), params)
          schema.value.properties[snakeToCamel(dataKey)] = getJsonSchema(schemas[dataKey]);
          // TODO 需要给没有设置值的参数设置默认值
          form.value.setFormState((state) => {
            // console.log("===> dataKey", dataKey, snakeToCamel(dataKey), params)
            state.values[snakeToCamel(dataKey)] = getJsonData(params[snakeToCamel(dataKey)]);
          });
        }
        console.log(
          'useModalInner schemaInfo ',
          cell,
          cell.store.data.nodeDetailSchema,
          cell.store.data.nodeDetailParams,
          schema.value
        );
      });

      const handleOk = () => {
        //更新普通节点中的数据
        console.log('handleOk', form.value.getFormState().values);

        // 更新form中的数据
        // for (const formSchema in formSchemas.value) {
        //   if (modelRef.value?.formModel[formSchemas.value[formSchema].field]) {
        //     formSchemas.value[formSchema].defaultValue = modelRef.value?.formModel[formSchemas.value[formSchema].field]
        //   }
        // }
        // 更新节点名称
        // const nodeDetailParams = toRaw(modelRef.value?.formModel)
        cellRef.value.prop('label', form.value.getFormState().values.name);
        const nodeDetailParams = form.value.getFormState().values;
        nodeDetailParams.category = cellRef.value.store.data.nodeDetailSchema.category;
        cellRef.value.prop('nodeDetailParams', nodeDetailParams);
        console.log("=====> meta ", cellRef.value)

        closeModal();
        showNodeEditModal.value = false;
      };

      return {
        showNodeEditModal,
        registerModal,
        handleOk,
        form,
        schema,
        formCollapse,
      };
    },
  });
</script>
