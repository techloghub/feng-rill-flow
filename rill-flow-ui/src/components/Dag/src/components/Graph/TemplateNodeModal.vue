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
    replaceUItreeData,
    replaceUIWidget,
  } from '@/components/Dag/src/common/replaceJsonSchemaConfig';
  import {
    getJsonData,
    getJsonFromYaml,
    getJsonSchema
  } from "@/components/Dag/src/components/Graph/methods";
  import { useTemplateNodeReferenceCache } from '@/components/Dag/src/store/dagStore';
  import { storeToRefs } from 'pinia';
  import { useProvideGraph } from '@/components/Dag/src/store/graph';
  import { GraphNodeReferenceUpdateParam } from '@/components/Dag/src/models/global';
  import { Cell } from '@antv/x6';

  const provideGraph = useProvideGraph();
  const { graphRef } = storeToRefs(provideGraph);
  const { getReferences, getNodeOutput, updateTemplateNodeParams } = provideGraph;
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
      cell.store.data.nodeDetailSchema,
    );
    const newSchema = (typeof cell.store.data.nodeDetailSchema?.schema === 'string') ? JSON.parse(cell.store.data.nodeDetailSchema?.schema) :cell.store.data.nodeDetailSchema?.schema;
    const data = cloneDeep(newSchema);

    replaceUIWidget(data);
    // 需要将该节点最新的reference数据更新到data中
    const references1 = getReferences(cell.id);
    replaceUItreeData(data, references1);
    console.log(
      'replaceUiTreeData',
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
    console.log('1.2 初始化基础参数的具体值 ', schemaParams, cell);
    for (const key in schemaParams.properties) {
      let inputMappings = cell.store.data.nodeDetailParams.inputMappings;
      const property = schemaParams.properties[key].title;
      console.log(
        'useModalInner schemaInfo jsonSchemaFormData schemaParams',
        key,
        schemaParams.properties[key],
        inputMappings,
        property,
      );
      for (const inputKey in inputMappings) {
        let inputTargetParam = inputMappings[inputKey].target.split('$.input.')[1];
        if (inputTargetParam === property) {
          if (inputMappings[inputKey].source.startsWith('$')) {
            jsonSchemaFormData[key] = {
              attr: 'reference',
              reference: inputMappings[inputKey].source.replace('.context', ''),
              input: '',
            };

            // console.log(
            //   'useModalInner schemaInfo jsonSchemaFormData schemaParams inner',
            //   key,
            //   schemaParams[key],
            //   inputKey,
            //   inputMappings[inputKey],
            //   inputTargetParam,
            //   inputMappings[inputKey].source.replace('.context', ''),
            //   jsonSchemaFormData[key],
            // );
          } else {
            jsonSchemaFormData[key] = {
              attr: 'input',
              input: inputMappings[inputKey].source,
              reference: '',
            };
          }
        }
      }
    }
    console.log('useModalInner schemaInfo jsonSchemaFormData end', jsonSchemaFormData);

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
    // 更新节点名称
    cellRef.value.prop('label', nodeForm.value.getFormState().values.name);
    // 更新模版数据

    let nodeDetailParams = advancedSettingsForm.value.getFormState().values;
    // nodeDetailParams['parameters'] = jsonSchemaFormData.value;
    const referenceUpdateParams: GraphNodeReferenceUpdateParam[] = [];
    for (const formKey in jsonSchemaFormData) {
      let updateInputMapping = false;
      let formItemValue =
        jsonSchemaFormData[formKey].reference !== ''
          ? jsonSchemaFormData[formKey].reference
          : jsonSchemaFormData[formKey].input;
      console.log('templateNode nodeDetailParams formKey', formKey, jsonSchemaFormData[formKey]);

      const item = new GraphNodeReferenceUpdateParam(
        cellRef.value.id,
        formKey,
        formItemValue,
        jsonSchemaFormData[formKey].attr,
      );
      referenceUpdateParams.push(item);
      // 变更节点参数
      updateTemplateNodeParams(referenceUpdateParams);

      for (const key in nodeDetailParams.inputMappings) {
        console.log(
          'templateNode nodeDetailParams key',
          key,
          nodeDetailParams.inputMappings[key],
          nodeDetailParams.inputMappings[key]['target'].split('$.input.')[1],
          jsonSchemaFormData,
        );
        let input = nodeDetailParams.inputMappings[key]['target'].split('$.input.')[1];
        if (input === formKey) {
          updateInputMapping = true;
          nodeDetailParams.inputMappings[key]['source'] = formItemValue;
          continue;
        }
      }
      if (!updateInputMapping) {
        if (nodeDetailParams.inputMappings === undefined){
          nodeDetailParams.inputMappings = [];
        }
        nodeDetailParams.inputMappings.push({
          source: formItemValue,
          target: `$.input.${formKey}`,
        });
      }
    }

    console.log('templateNode nodeDetailParams', nodeDetailParams);
    // cellRef.value.prop('nodeDetailParams', nodeDetailParams);
    // cellRef.value.prop('taskYamlData', jsonSchemaFormData.value);

    closeModal();
    showNodeEditModal.value = false;
    console.log('handleOk end', cellRef.value, graphRef.value?.getCellById(cellRef.value.id));
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
