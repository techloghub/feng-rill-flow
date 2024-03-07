<template>
  <BasicModal v-bind="$attrs" title="节点编辑" @register="registerModal" @ok="handleOk" width="70%">
    <div v-if="jsonSchemaFormType">
      <Form :form="nodeForm">
        <SchemaField :schema="nodeSchema" />
      </Form>
      <a-tabs v-modgit adel:activeKey="activeKey">
        <a-tab-pane key="1" tab="基础设置">
          <a-card title="Input">
            <VueForm v-model="jsonSchemaFormData" :schema="jsonSchema" :formProps="formProps">
              <div slot-scope="{ jsonSchemaFormData }"></div>
            </VueForm>
          </a-card>
          <a-card title="Output">
            <BasicTree :treeData="treeData" />
          </a-card>
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
  import { inject, onMounted, ref, Ref, toRaw, reactive } from 'vue';
  import VueForm from '@lljj/vue3-form-ant';
  import { BasicTree } from '@/components/Tree';
  import { createForm } from '@formily/core';
  import { createSchemaField, FormProvider } from '@formily/vue';
  import { cloneDeep } from 'lodash-es';
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
    replaceUIWidget,
  } from '@/components/Dag/src/common/replaceJsonSchemaConfig';
  import {
    getJsonByJsonPaths,
    getJsonData,
    getJsonFromYaml, getJsonPathByJsonSchema,
    getJsonSchema, getMapByJson
  } from "@/components/Dag/src/components/Graph/methods";
  import { useTemplateNodeReferenceCache } from '@/components/Dag/src/store/dagStore';
  import { storeToRefs } from 'pinia';
  import { useProvideGraph } from '@/components/Dag/src/store/graph';
  import { GraphNodeReferenceUpdateParam } from '@/components/Dag/src/models/global';
  import { Cell } from '@antv/x6';

  const provideGraph = useProvideGraph();
  const { graphRef } = storeToRefs(provideGraph);
  const { getReferences, getNodeOutput, updateTemplateNodeParams, getNodeInputSchema, containTask } = provideGraph;
  const showNodeEditModal: any = inject('showNodeEditModal');

  const cellRef: Ref<Cell> = ref();

  const jsonSchemaFormType = ref(false);
  let jsonSchemaFormData = reactive({});

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
  const { templateNodeReferenceMap } = storeToRefs(templateNodeReferenceCache);

  // Modal初始化配置
  const [registerModal, { closeModal }] = useModalInner((cell) => {

    // 1.1 初始化基础参数的schema
    activeKey.value = '1';
    cellRef.value = cell;
    jsonSchemaFormData = reactive({});
    jsonSchemaFormType.value = true;
    formProps.value = {
      labelPosition: 'left',
      labelSuffix: '：',
    };

    // 通过节点信息生成对应的jsonSchema
    console.log(
      'replaceUIWidget init',
      cell,
    );
    const newSchema = (typeof cell.store.data.nodeDetailSchema?.schema === 'string') ? JSON.parse(cell.store.data.nodeDetailSchema?.schema) :cell.store.data.nodeDetailSchema?.schema;
    const data = cloneDeep(newSchema);

    const references1 = getReferences(cell.id);

    replaceUIWidget(data, references1);
    // 需要将该节点最新的reference数据更新到data中
    console.log(
      'replaceUIWidget',
      data,
      templateNodeReferenceMap,
      references1,
      cell.store.data.nodeDetailSchema?.schema,
      cell,
    );
    jsonSchema.value = data;

    // 1.2 初始化基础参数的具体值
    nodeForm.value.setFormState((state) => {
      state.values['name'] = cell.store.data.label;
    });

    // TODO 将schema中的数据获取对应的inputmapping值
    let schemaParams = JSON.parse(cell.store.data.nodeDetailSchema.schema);
    const schemaParamsList = getJsonPathByJsonSchema(schemaParams.properties);
    let inputMappings = cell.store.data.nodeDetailParams.inputMappings;
    console.log('1.2 初始化基础参数的具体值 ', schemaParams, cell, schemaParamsList, inputMappings);
    let jsonSchemaFormDataList = [];
    for (const schemaParamsListKey in schemaParamsList) {
      console.log("初始化基础参数的具体值 ", schemaParamsListKey, schemaParamsList[schemaParamsListKey]);
      for (const inputKey in inputMappings) {
        let inputTargetParam = inputMappings[inputKey].target.split('$.input.')[1];
        if (inputTargetParam === schemaParamsList[schemaParamsListKey]) {
          console.log('初始化基础参数的具体值 实际值', inputTargetParam,inputMappings[inputKey].source)
          if (inputMappings[inputKey].source.startsWith('$')) {
            let isNodeTemplate = false;
            if (inputMappings[inputKey].source.startsWith('$.context.')) {
              const maybeTaskName = inputMappings[inputKey].source.split('.')[2];
              isNodeTemplate = containTask(maybeTaskName)
              console.log('初始化基础参数的具体值 是否为node', inputMappings[inputKey].source, maybeTaskName, containTask(maybeTaskName));
            }
            jsonSchemaFormDataList.push({
              key: inputTargetParam,
              value: {
                attr: 'reference',
                reference: isNodeTemplate ? inputMappings[inputKey].source.replace('.context', '') : inputMappings[inputKey].source,
                // reference: inputMappings[inputKey].source.replace('.context', ''),
                input: '',
              }
            });
          } else {
            jsonSchemaFormDataList.push({
              key: inputTargetParam,
              value: {
                attr: 'input',
                input: inputMappings[inputKey].source,
                reference: '',
              }
            });
          }
        }
      }
    }

    console.log('useModalInner schemaInfo jsonSchemaFormDataList', jsonSchemaFormDataList, getJsonByJsonPaths(jsonSchemaFormDataList));
    jsonSchemaFormData = getJsonByJsonPaths(jsonSchemaFormDataList);

    // 高级参数初始化设置
    const advancedSettingsSchemas = cell.store.data.nodeDetailSchema.meta_data.fields;
    let advancedSettingsParams = cell.store.data.nodeDetailParams;
    if ('task' in cell.store.data.nodeDetailParams) {
      // TODO 需要统一格式
      console.log(
        '===> advancedSettingsParams',
        advancedSettingsParams,
        cell.store.data.nodeDetailParams,
        cell.store.data.nodeDetailSchema.task_yaml,
        getJsonFromYaml(cell.store.data.nodeDetailSchema.task_yaml),
      );
      advancedSettingsParams = getJsonFromYaml(cell.store.data.nodeDetailSchema.task_yaml);
    }

    function snakeToCamel(str) {
      return str.replace(/_([a-z])/g, (match, letter) => letter.toUpperCase());
    }
    for (const dataKey in advancedSettingsSchemas) {
      advancedSettingsSchema.value.properties[snakeToCamel(dataKey)] = getJsonSchema(
        advancedSettingsSchemas[dataKey],
      );
      console.log('===> dataKey advancedSettingsSchemas', advancedSettingsSchema.value);
      // TODO 需要给没有设置值的参数设置默认值
      advancedSettingsForm.value.setFormState((state) => {
        console.log('dataKey1 advancedSettingsSchemas state', snakeToCamel(dataKey), advancedSettingsParams[snakeToCamel(dataKey)])
        state.values[snakeToCamel(dataKey)] = getJsonData(
          advancedSettingsParams[snakeToCamel(dataKey)],
        );
      });
    }

    treeData.value = getNodeOutput(cell.id);
  });
  const activeKey = ref('1');

  const handleOk = () => {
    //更新普通节点中的数据

    // 更新模版节点中的数据
    console.log(
      'handleOk start',
      cellRef.value,
      jsonSchemaFormData,
      toRaw(jsonSchemaFormData),
      nodeSchema.value,
      advancedSettingsForm.value.getFormState().values,
      nodeForm.value.getFormState().values,
      nodeForm.value.getFormState().values.name,
    );

    // 更新模版数据

    // 更新节点名称
    cellRef.value.prop('label', nodeForm.value.getFormState().values.name);
    const nodeDetailParams = advancedSettingsForm.value.getFormState().values;
    nodeDetailParams.category = cellRef.value.store.data.nodeDetailSchema.category;
    nodeDetailParams.name = nodeForm.value.getFormState().values.name;
    cellRef.value.prop('nodeDetailParams', nodeDetailParams);

    const referenceUpdateParams: GraphNodeReferenceUpdateParam[] = [];
    const formDataMap = getMapByJson(toRaw(jsonSchemaFormData));
    console.log('templateNode nodeDetailParams formDataKey', toRaw(jsonSchemaFormData), formDataMap);
    const formValueConvertMap = {}
    for (const formDataKey in formDataMap) {
      console.log('templateNode nodeDetailParams formDataKey', formDataKey, formDataMap[formDataKey]);
      if (formDataKey.endsWith('attr')) {
        let argsType = formDataMap[formDataKey]; // input/reference
        let argsKey = formDataKey.slice(0,-5);
        let argsValue = formDataMap[formDataKey.slice(0,-4)+formDataMap[formDataKey]];

        console.log('templateNode nodeDetailParams formDataKey attr ===>', formDataMap[formDataKey], formDataKey.slice(0,-4)+formDataMap[formDataKey], formDataMap[formDataKey.slice(0,-4)+formDataMap[formDataKey]], argsType, argsKey, argsValue)
        const item = new GraphNodeReferenceUpdateParam(
          cellRef.value.id,
          argsKey,
          argsValue,
          argsType,
        );
        referenceUpdateParams.push(item);
        console.log('templateNode nodeDetailParams formDataKey item', item);

        // 变更节点参数
        continue;
      }
    }
    updateTemplateNodeParams(referenceUpdateParams);


    closeModal();
    showNodeEditModal.value = false;
    console.log('handleOk end', cellRef.value, graphRef.value?.getCellById(cellRef.value.id), nodeDetailParams);
  };

  function splitStringAtLastDot(str) {
    const lastIndex = str.lastIndexOf('.');
    if (lastIndex !== -1) {
      const part1 = str.substring(0, lastIndex);
      const part2 = str.substring(lastIndex + 1);
      return [part1, part2];
    }
    return [str, ''];
  }

  const jsonSchema = ref({});

  onMounted(() => {
    jsonSchema.value = {
      type: 'object',
      required: [],
      properties: {},
    };
  });
</script>
