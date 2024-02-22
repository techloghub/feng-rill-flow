<template>
  <BasicModal
    v-bind="$attrs"
    title="节点编辑"
    :helpMessage="['提示1', '提示2']"
    @register="registerModal"
    @ok="handleOk"
    width="40%"
  >
    <div v-if="jsonSchemaFormType">
      <Form :form="nodeForm">
        <SchemaField :schema="nodeSchema" />
      </Form>
      <a-tabs v-model:activeKey="activeKey">
        <a-tab-pane key="1" tab="基础设置">
          <VueForm v-model="jsonSchemaFormData" :schema="jsonSchema" :formProps="formProps">
            <div slot-scope="{ jsonSchemaFormData }"></div>
          </VueForm>
          <BasicTree title="Output" :treeData="treeData" defaultExpandLevel="1" />
        </a-tab-pane>
        <a-tab-pane key="3" tab="高级设置">
          <FormProvider :form="advancedSettingsForm">
            <SchemaField :schema="advancedSettingsSchema" :scope="{ formCollapse }" />
          </FormProvider>
        </a-tab-pane>
      </a-tabs>
    </div>
  </BasicModal>
</template>
<script lang="ts" setup>
  import { inject, onMounted, ref, Ref, toRaw } from 'vue';
  import VueForm from '@lljj/vue3-form-ant';
  import { BasicTree } from '@/components/Tree';
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
  import { BasicModal, useModalInner } from '@/components/Modal';
  import {
    replaceUItreeData,
    replaceUIWidget,
  } from '@/components/Dag/src/common/replaceJsonSchemaConfig';
  import {
    convertJSON,
    getJsonData,
    getJsonSchema,
  } from '@/components/Dag/src/components/Graph/methods';
  import { useTemplateNodeReferenceCache } from '@/components/Dag/src/store/dagStore';
  import { storeToRefs } from 'pinia';
  import { useProvideGraph } from '@/components/Dag/src/store/graph';
  import {
    getNodeReferences,
  } from '@/components/Dag/src/common/graphTransform';

  const provideGraph = useProvideGraph();
  const { graphRef } = storeToRefs(provideGraph);
  const { getReferences } = provideGraph;
  const showNodeEditModal: any = inject('showNodeEditModal');

  const modelRef = ref({});
  const cellRef = ref({});
  const formSchemas: Ref<any | undefined> = ref([]);
  const jsonSchemaFormType = ref(false);
  const jsonSchemaFormData = ref({});

  const treeData = ref();
  const formProps = ref({});
  const nodeSchema = ref({
    type: 'object',
    properties: {
      name: {
        type: 'string',
        title: '节点名称',
        'x-decorator': 'FormItem',
        'x-component': 'Input',
      },
    },
  });

  // 基础设置参数和方法
  const nodeForm = ref();
  nodeForm.value = createForm();
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

  //高级设置参数和方法
  const advancedSettingsForm = ref();
  advancedSettingsForm.value = createForm();
  const formCollapse = ref();
  formCollapse.value = FormCollapse.createFormCollapse();

  const advancedSettingsSchema = ref();
  advancedSettingsSchema.value = {
    type: 'object',
    properties: {},
  };

  // 获取reference
  const templateNodeReferenceCache = useTemplateNodeReferenceCache();
  const { getTemplateNodeReferenceByKey } = templateNodeReferenceCache;
  const { templateNodeReferenceMap } = storeToRefs(templateNodeReferenceCache);

  // Modal初始化配置
  const [registerModal, { closeModal }] = useModalInner((cell) => {
    // 获取指定节点的reference start
    if (graphRef.value !== undefined) {
      // graph
      // let newDagDetail1 = transferDagJson(graphRef.value);
      // let newDagDetail2 = getNodeReferences(graphRef.value, cell.store.data.label);
      // console.log('useModalInner schemaInfo init reference', newDagDetail2, cell);
    } else {
      console.log('useModalInner schemaInfo graphRef is undefined');
    }
    // 获取指定节点的reference end

    // 初始化基本数据
    cellRef.value = cell;
    activeKey.value = '1';
    console.log(
      'useModalInner schemaInfo init',
      cell,
      cell.id,
      cellRef.value,
      nodeSchema.value,
      cell.store.data.nodeDetailParams.parameters,
      cell.store.data.nodeDetailSchema,
    );
    jsonSchemaFormType.value = true;
    formProps.value = {
      labelPosition: 'left',
      labelSuffix: '：',
    };

    // 通过节点信息生成对应的jsonSchema

    const data = cell.store.data.nodeDetailSchema?.schema;
    replaceUIWidget(data);

    // 需要将该节点最新的reference数据更新到data中
    replaceUItreeData(data, getReferences(cell.id));
    console.log('replaceUiTreeData', data, templateNodeReferenceMap);
    jsonSchema.value = data;
    // 基础参数设置
    nodeForm.value.setFormState((state) => {
      state.values['name'] = cell.store.data.label;
    });

    // jsonSchemaFormData.value = cell.store.data.nodeDetailParams.parameters;
    // TODO 将schema中的数据获取对应的inputmapping值
    let schemaParams = cell.store.data.nodeDetailSchema?.schema.properties;
    for (const key in schemaParams) {
      console.log(
        'useModalInner schemaInfo jsonSchemaFormData schemaParams',
        key,
        schemaParams[key],
      );
      let inputMappings = cell.store.data.nodeDetailParams.inputMappings;
      for (const inputKey in inputMappings) {
        console.log(
          'useModalInner schemaInfo jsonSchemaFormData schemaParams',
          key,
          schemaParams[key],
          inputKey,
          inputMappings[inputKey],
        );
        let inputTargetParam = inputMappings[inputKey].target.split('$.input.')[1];
        if (inputTargetParam === key) {
          if (inputMappings[inputKey].source.startsWith('$')) {
            jsonSchemaFormData.value[key] = {
              attr: 'reference',
              reference: inputMappings[inputKey].source,
              input: '',
            };
          } else {
            jsonSchemaFormData.value[key] = {
              attr: 'input',
              input: inputMappings[inputKey].source,
              reference: '',
            };
          }
        }
      }
    }
    console.log(
      'useModalInner schemaInfo jsonSchemaFormData',
      jsonSchemaFormData.value,
      cell.store.data.nodeDetailParams.inputMappings,
      cell.store.data.nodeDetailSchema?.schema,
      cell.store.data.nodeDetailParams,
    );

    // 高级参数初始化设置
    const advancedSettingsSchemas = cell.store.data.nodeDetailSchema.meta_data.fields;
    let advancedSettingsParams = cell.store.data.nodeDetailParams;
    if ('task' in cell.store.data.nodeDetailParams) {
      // TODO 需要统一格式
      console.log(
        '===> advancedSettingsParams',
        advancedSettingsParams,
        cell.store.data.nodeDetailParams.task,
      );
      advancedSettingsParams = cell.store.data.nodeDetailSchema.task_yaml;
    }

    function snakeToCamel(str) {
      return str.replace(/_([a-z])/g, (match, letter) => letter.toUpperCase());
    }
    for (const dataKey in advancedSettingsSchemas) {
      advancedSettingsSchema.value.properties[snakeToCamel(dataKey)] = getJsonSchema(
        advancedSettingsSchemas[dataKey],
      );
      // // TODO 需要给没有设置值的参数设置默认值
      advancedSettingsForm.value.setFormState((state) => {
        // console.log("===> dataKey", dataKey, snakeToCamel(dataKey), params)
        state.values[snakeToCamel(dataKey)] = getJsonData(
          advancedSettingsParams[snakeToCamel(dataKey)],
        );
      });
    }

    // TODO formOutput 需要通过接口返回的output数据生成
    const output = cell.store.data.nodeDetailSchema?.output;
    // output.name = cell.store.data.label;
    const outputList = convertJSON(output);
    treeData.value = outputList;
  });
  const activeKey = ref('1');

  const handleOk = () => {
    //更新普通节点中的数据

    console.log(
      'handleOk',
      jsonSchemaFormData.value,
      modelRef.value?.formModel,
      formSchemas.value,
      cellRef.value,
    );

    // 更新模版节点中的数据
    console.log(
      'handleOk',
      cellRef.value,
      jsonSchemaFormData.value,
      toRaw(jsonSchemaFormData.value),
      nodeSchema.value,
      advancedSettingsForm.value.getFormState().values,
      nodeForm.value.getFormState().values,
      nodeForm.value.getFormState().values.name,
    );
    // 更新节点名称
    cellRef.value.prop('label', nodeForm.value.getFormState().values.name);
    // 更新模版数据

    let nodeDetailParams = advancedSettingsForm.value.getFormState().values;
    // nodeDetailParams['parameters'] = jsonSchemaFormData.value;
    for (const formKey in jsonSchemaFormData.value) {
      let updateInputMapping = false;
      let formItemValue =
        jsonSchemaFormData.value[formKey].reference !== ''
          ? jsonSchemaFormData.value[formKey].reference
          : jsonSchemaFormData.value[formKey].input;
      console.log(
        'templateNode nodeDetailParams formKey',
        formKey,
        jsonSchemaFormData.value[formKey],
      );
      for (const key in nodeDetailParams.inputMappings) {
        console.log(
          'templateNode nodeDetailParams key',
          key,
          nodeDetailParams.inputMappings[key],
          nodeDetailParams.inputMappings[key]['target'].split('$.input.')[1],
          jsonSchemaFormData.value,
        );
        let input = nodeDetailParams.inputMappings[key]['target'].split('$.input.')[1];
        if (input === formKey) {
          updateInputMapping = true;
          nodeDetailParams.inputMappings[key]['source'] = formItemValue;
          continue;
        }
      }
      if (!updateInputMapping) {
        nodeDetailParams.inputMappings.push({
          source: formItemValue,
          target: `$.input.${formKey}`,
        });
      }
    }

    console.log('templateNode nodeDetailParams', nodeDetailParams);
    cellRef.value.prop('nodeDetailParams', nodeDetailParams);
    // cellRef.value.prop('taskYamlData', jsonSchemaFormData.value);

    closeModal();
    showNodeEditModal.value = false;
  };

  const jsonSchema = ref({});

  onMounted(() => {
    jsonSchema.value = {
      type: 'object',
      required: [],
      properties: {},
    };
  });
</script>
