<template>
  <BasicModal
    v-bind="$attrs"
    title="节点编辑"
    :helpMessage="['提示1', '提示2']"
    @register="registerModal"
    @ok="handleOk"
  >
    <div v-if="!jsonSchemaFormType">
      <BasicForm
        ref="modelRef"
        :schemas="formSchemas"
        :showActionButtonGroup="false"
        @register="registerForm"
      />
    </div>
    <div v-if="jsonSchemaFormType">
      <VueForm
        v-model="jsonSchemaFormData"
        :schema="jsonSchema"
        :ui-schema="jsonUiSchema"
      >
        <div slot-scope="{jsonSchemaFormData}"></div>
      </VueForm>

      <BasicTree title="Output" :treeData="treeData" defaultExpandLevel="1">
        <template></template>
      </BasicTree>

    </div>

  </BasicModal>

</template>
<script lang="ts" setup>
import {createVNode, h, inject, onMounted, ref, Ref, shallowRef, toRaw} from "vue";
import {useI18n} from '@/hooks/web/useI18n';
import {BasicForm, FormSchema, useForm} from '@/components/Form';
import VueForm from '@lljj/vue3-form-ant';
import {BasicTree, TreeActionType, TreeItem} from '@/components/Tree';

const {t} = useI18n();
const showNodeEditModal: any = inject('showNodeEditModal');

import {BasicModal, useModalInner} from '@/components/Modal';
import {Testwidget} from "@/components/Widget";
import {replaceUIWidget} from "@/components/Dag/src/components/NodesBar/methods";
import {RILL_CATEGORY} from "@/components/Dag";
import {Switch, Tag, Typography} from "ant-design-vue";
import FlowStatus from "@/components/Dag/src/components/Templates/FlowStatus.vue";
import {BasicColumn, BasicTable} from "@/components/Table";
import BlockText from "@/components/Dag/src/components/Templates/BlockTypography.vue";
import {convertJSON} from "@/components/Dag/src/components/Graph/methods";


const modelRef = ref({});
const cellRef = ref({});
const formSchemas: Ref<any | undefined> = ref([])
const jsonSchemaFormType = ref(false)
const schema = ref([]);
const jsonSchemaFormData = ref()

const [registerForm, {validate}] = useForm();
const treeData = ref()

const [registerModal, {closeModal}] = useModalInner((cell) => {
  cellRef.value = cell
  console.log("useModalInner schemaInfo ", cell, cellRef.value)
  const data = cell.store.data.nodeDetailSchema?.node_type === 'meta' ? cell.store.data.nodeDetailSchema.fields : cell.store.data.nodeDetailSchema?.schema
  // schema.value = data

  const type = cell.store.data.nodeDetailSchema?.node_type ? cell.store.data.nodeDetailSchema.node_type : 'other'
  let schemaList = []
  if (type === 'meta') {
    jsonSchemaFormType.value = false

    for (const dataKey in data) {
      // TODO 获取参数的默认值
      const value = {}
      // const value = {
      //     "resource_name": "1",
      //     "resource_protocol": "2",
      //     "request_type": "3",
      //     "pattern": "4",
      //     "input_mappings": "5",
      //     "output_mappings": "6",
      //     "success_conditions": "6",
      //     "fail_conditions": "7",
      //     "retry": "7111",
      //     "next": "7"
      //   }
      // console.log("formSchemas", dataKey, value[dataKey])
      // let item = buildComponent(data[dataKey])
      let schemaItem = {
        field: dataKey,
        label: data[dataKey].name,
        rules: [{required: data[dataKey].required}],
      }
      if (value[dataKey]) {
        // 设置form中每个参数的默认值
        schemaItem["defaultValue"] = value[dataKey]
      }
      buildComponent(data[dataKey], schemaItem)
      schemaList.push(schemaItem)
      formSchemas.value = schemaList
    }

  } else if (type === 'template') {
    console.log("template====>", cell)
    jsonSchemaFormType.value = true
    // formSchemas.value = data.schema
    replaceUIWidget(data)
    jsonSchema.value = data
    // TODO formOutput 需要通过接口返回的output数据生成
    const output = cell.store.data.nodeDetailSchema?.output
    const outputList = convertJSON(output)
    treeData.value = outputList
    console.log("template====> output", output, outputList, treeData)

    // jsonSchemaFormData.value = data.schema

  }
});

// TODO 需要设置指定schema
function buildComponent(rule, schemaItem) {

  if(rule.type === 'list' && rule.data) {

  }


  if(rule.options) {
    schemaItem.component = 'Select'
    let schemaItemOptions = []
    for (const optionsKey in rule.options) {
      console.log("rule.options", optionsKey,rule.options[optionsKey])
      schemaItemOptions.push({
        "label": rule.options[optionsKey].name,
        "value": rule.options[optionsKey].value,
        "key": rule.options[optionsKey].value,
      })
    }
    schemaItem.componentProps = {
      options: schemaItemOptions
    }
    return
  }

  if (rule.type === 'boolean') {
    schemaItem.component = 'Switch'
    return
  }

  schemaItem.component = 'Input'
}

const handleOk = () => {

  //更新普通节点中的数据
  const type = cellRef.value.store.data.nodeDetailSchema?.node_type ? cellRef.value.store.data.nodeDetailSchema.node_type : 'other'
  console.log("handleOk", type, jsonSchemaFormData.value, modelRef.value?.formModel, formSchemas.value, cellRef.value)

  if (type === 'meta'){
    // 更新form中的数据
    for (const formSchema in formSchemas.value) {
      if (modelRef.value?.formModel[formSchemas.value[formSchema].field]) {
        formSchemas.value[formSchema].defaultValue = modelRef.value?.formModel[formSchemas.value[formSchema].field]
      }
    }
    // 更新节点名称
    const nodeDetailParams = toRaw(modelRef.value?.formModel)
    cellRef.value.prop('label', modelRef.value?.formModel.name)
    cellRef.value.prop('nodeDetailParams', nodeDetailParams)
    console.log("=====> meta ", modelRef.value?.formModel, nodeDetailParams)
  } else if(type === 'template') {
    // 更新模版节点中的数据
    console.log("handleOk", cellRef.value, toRaw(jsonSchemaFormData.value))
    if (jsonSchemaFormData.value.name) {
      cellRef.value.prop('label', jsonSchemaFormData.value.name)
      cellRef.value.prop('nodeDetailParams', jsonSchemaFormData.value)
    }
  }

  closeModal();
  showNodeEditModal.value = false
};

const formData = ref({});
const jsonSchema = ref({});


onMounted(() => {

  jsonSchema.value = {
    type: 'object',
    required: [
      'userName',
      'age',
    ],
    properties: {
      // input: {
      //   type: 'array',
      //   title: "input",
      //   items: {
      //     type: 'object',
      //     properties: {
      //       name: {
      //         title: 'name',
      //         type: 'string',
      //         'ui:width': '30%'
      //       },
      //       attr: {
      //         title: '类型',
      //         type: 'string',
      //         enum: [
      //           'input',
      //           'reference'
      //         ],
      //         enumNames: [
      //           'input',
      //           'reference'
      //         ],
      //         'ui:width': '30%'
      //       },
      //       input: {
      //         title: '文本',
      //         type: 'string',
      //         'ui:hidden': "{{parentFormData.attr !== 'input'}}",
      //         'ui:width': '40%'
      //       },
      //       reference: {
      //         title: 'reference',
      //         type: 'string',
      //         // pattern: '^[0-9]+$',
      //         // message: {
      //         //   pattern: '输入正确得分'
      //         // },
      //         // default: JSON.stringify([{"title":"parent11111","value":"parent1","children":[{"title":"parent 1-0","value":"parent 1-0","children":[{"title":"my leaf","value":"leaf1"},{"title":"your leaf","value":"leaf2"}]},{"title":"parent 1-1","value":"parent 1-1"}]}]),
      //         default: 's',
      //         'ui:hidden': "{{parentFormData.attr !== 'reference'}}",
      //         'ui:width': '40%',
      //         "ui:widget": componentRef,
      //         'ui:treeData': [{"title":"parent11111","value":"parent1","children":[{"title":"parent 1-0","value":"parent 1-0","children":[{"title":"my leaf","value":"leaf1"},{"title":"your leaf","value":"leaf2"}]},{"title":"parent 1-1","value":"parent 1-1"}]}],
      //       },
      //     }
      //   }
      // },
      paramA: {
        title: "paramA",
        properties: {
          attr: {
            title: '类型',
            type: 'string',
            enum: [
              'input',
              'reference'
            ],
            enumNames: [
              'input',
              'reference'
            ],
            'ui:width': '30%'
          },
          input: {
            title: '文本',
            type: 'string',
            'ui:hidden': "{{parentFormData.attr !== 'input'}}",
            'ui:width': '40%'
          },
          reference: {
            title: 'reference',
            type: 'string',
            // pattern: '^[0-9]+$',
            // message: {
            //   pattern: '输入正确得分'
            // },
            // default: JSON.stringify([{"title":"parent11111","value":"parent1","children":[{"title":"parent 1-0","value":"parent 1-0","children":[{"title":"my leaf","value":"leaf1"},{"title":"your leaf","value":"leaf2"}]},{"title":"parent 1-1","value":"parent 1-1"}]}]),
            default: 's',
            'ui:hidden': "{{parentFormData.attr !== 'reference'}}",
            'ui:width': '40%',
            "ui:widget": Testwidget,
            'ui:treeData': [{
              "title": "parent11111",
              "value": "parent1",
              "children": [{
                "title": "parent 1-0",
                "value": "parent 1-0",
                "children": [{"title": "my leaf", "value": "leaf1"}, {"title": "your leaf", "value": "leaf2"}]
              }, {"title": "parent 1-1", "value": "parent 1-1"}]
            }],
          },
        }
      }
    }
  }
});
const commonTagRender = (color: string) => (curVal) => h(Tag, {color}, () => curVal);

function getSchema(category) {
  switch (category) {
    case RILL_CATEGORY.FOREACH:
      return [
        {
          field: 'name',
          label: t('routes.flow.instances.graph.node.schema.name'),
          render: (text) => {
            return createVNode(Typography.Paragraph, {underline: true}, {default: () => text});
          }
        },
        {
          field: 'category',
          label: t('routes.flow.instances.graph.node.schema.category'),
          render: commonTagRender("blue")
        },
        {
          field: 'tolerance',
          label: t('routes.flow.instances.graph.node.schema.tolerance'),
          render: (text) => {
            return createVNode(Switch, {checked: text === 'true', disabled: true});
          }
        },
        {
          field: 'status',
          label: t('routes.flow.instances.graph.node.schema.status'),
          render: (text) => {
            return createVNode(FlowStatus, {status: text});
          }
        },
        {
          field: 'iterationMapping',
          label: t('routes.flow.instances.graph.node.schema.iteration_msg'),
          render: (text) => {
            function getBasicShortColumns(): BasicColumn[] {
              return [
                {
                  title: t('routes.flow.instances.graph.node.schema.iteration_msg_key'),
                  dataIndex: 'key',
                },
                {
                  title: t('routes.flow.instances.graph.node.schema.iteration_msg_value'),
                  dataIndex: 'value',
                }
              ];
            }

            let result = text !== undefined ? JSON.parse(text) : {}
            const data: any = []
            for (const key in result) {
              data.push({
                "key": key,
                "value": typeof result[key] === 'string' ? result[key] : JSON.stringify(result[key])
              })
            }
            return createVNode(BasicTable, {
              showIndexColumn: false,
              canResize: false,
              columns: getBasicShortColumns(),
              dataSource: data,
              pagination: false
            }, {default: () => data});
          }
        },
      ];
      break;
    case RILL_CATEGORY.RETURN:
      return [
        {
          field: 'name',
          label: t('routes.flow.instances.graph.node.schema.name'),
          render: (text) => {
            return createVNode(Typography.Paragraph, {underline: true}, {default: () => text});
          }
        },
        {
          field: 'category',
          label: t('routes.flow.instances.graph.node.schema.category'),
          render: commonTagRender("blue")
        },
        {
          field: 'tolerance',
          label: t('routes.flow.instances.graph.node.schema.tolerance'),
          render: (text) => {
            return createVNode(Switch, {checked: text === 'true', disabled: true});
          }
        },
        {
          field: 'status',
          label: t('routes.flow.instances.graph.node.schema.status'),
          render: (text) => {
            return createVNode(FlowStatus, {status: text});
          }
        },
        {
          field: 'inputMappings',
          label: t('routes.flow.instances.graph.node.schema.input_mappings'),
          render: (text) => {
            function getBasicShortColumns(): BasicColumn[] {
              return [
                {
                  title: t('routes.flow.instances.graph.node.schema.input_mappings_source'),
                  dataIndex: 'source',
                },
                {
                  title: t('routes.flow.instances.graph.node.schema.input_mappings_target'),
                  dataIndex: 'target',
                }
              ];
            }

            let result = text !== undefined ? JSON.parse(text) : {}
            const data: any = []

            for (const key in result) {
              data.push({
                "source": result[key].source,
                "target": result[key].target,
              })
            }
            return createVNode(BasicTable, {
              showIndexColumn: false,
              canResize: false,
              columns: getBasicShortColumns(),
              dataSource: data,
              pagination: false
            }, {default: () => data});
          }
        },
        {
          field: 'conditions',
          label: t('routes.flow.instances.graph.node.schema.conditions'),
          render: (text) => {
            function getBasicShortColumns(): BasicColumn[] {
              return [
                {
                  title: t('routes.flow.instances.graph.node.schema.input_mappings_source'),
                  dataIndex: 'value',
                }
              ];
            }

            let result = text !== undefined ? JSON.parse(text) : {}
            const data: any = []
            for (const key in result) {
              data.push({
                "value": result[key],
              })
            }
            return createVNode(BasicTable, {
              showIndexColumn: false,
              canResize: false,
              columns: getBasicShortColumns(),
              dataSource: data,
              pagination: false
            }, {default: () => data});
          }
        }
      ];
      break;
    case RILL_CATEGORY.PASS:
      return [
        {
          field: 'name',
          label: t('routes.flow.instances.graph.node.schema.name'),
          render: (text) => {
            return createVNode(Typography.Paragraph, {underline: true}, {default: () => text});
          }
        },
        {
          field: 'category',
          label: t('routes.flow.instances.graph.node.schema.category'),
          render: commonTagRender("blue")
        },
        {
          field: 'tolerance',
          label: t('routes.flow.instances.graph.node.schema.tolerance'),
          render: (text) => {
            return createVNode(Switch, {checked: text === 'true', disabled: true});
          }
        },
        {
          field: 'status',
          label: t('routes.flow.instances.graph.node.schema.status'),
          render: (text) => {
            return createVNode(FlowStatus, {status: text});
          }
        },
        {
          field: 'inputMappings',
          label: t('routes.flow.instances.graph.node.schema.input_mappings'),
          render: (text) => {
            function getBasicShortColumns(): BasicColumn[] {
              return [
                {
                  title: t('routes.flow.instances.graph.node.schema.input_mappings_source'),
                  dataIndex: 'source',
                },
                {
                  title: t('routes.flow.instances.graph.node.schema.input_mappings_target'),
                  dataIndex: 'target',
                }
              ];
            }

            let result = text !== undefined ? JSON.parse(text) : {}
            const data: any = []

            for (const key in result) {
              data.push({
                "source": result[key].source,
                "target": result[key].target,
              })
            }
            return createVNode(BasicTable, {
              showIndexColumn: false,
              canResize: false,
              columns: getBasicShortColumns(),
              dataSource: data,
              pagination: false
            }, {default: () => data});
          }
        },
        {
          field: 'outputMappings',
          label: t('routes.flow.instances.graph.node.schema.output_mappings'),
          render: (text) => {
            function getBasicShortColumns(): BasicColumn[] {
              return [
                {
                  title: t('routes.flow.instances.graph.node.schema.output_mappings_source'),
                  dataIndex: 'source',
                },
                {
                  title: t('routes.flow.instances.graph.node.schema.output_mappings_target'),
                  dataIndex: 'target',
                }
              ];
            }

            let result = text !== undefined ? JSON.parse(text) : {}
            const data: any = []

            for (const key in result) {
              data.push({
                "source": result[key].source,
                "target": result[key].target,
              })
            }
            return createVNode(BasicTable, {
              showIndexColumn: false,
              canResize: false,
              columns: getBasicShortColumns(),
              dataSource: data,
              pagination: false
            }, {default: () => data});
          }
        },
        {
          field: 'conditions',
          label: t('routes.flow.instances.graph.node.schema.conditions'),
          render: (text) => {
            function getBasicShortColumns(): BasicColumn[] {
              return [
                {
                  title: t('routes.flow.instances.graph.node.schema.input_mappings_source'),
                  dataIndex: 'value',
                }
              ];
            }

            let result = text !== undefined ? JSON.parse(text) : {}
            const data: any = []
            for (const key in result) {
              data.push({
                "value": result[key],
              })
            }
            return createVNode(BasicTable, {
              showIndexColumn: false,
              canResize: false,
              columns: getBasicShortColumns(),
              dataSource: data,
              pagination: false
            }, {default: () => data});
          }
        }
      ];
      break;
    case RILL_CATEGORY.SUSPENSE:
      return [
        {
          field: 'name',
          label: t('routes.flow.instances.graph.node.schema.name'),
          render: (text) => {
            return createVNode(Typography.Paragraph, {underline: true}, {default: () => text});
          }
        },
        {
          field: 'category',
          label: t('routes.flow.instances.graph.node.schema.category'),
          render: commonTagRender("blue")
        },
        {
          field: 'tolerance',
          label: t('routes.flow.instances.graph.node.schema.tolerance'),
          render: (text) => {
            return createVNode(Switch, {checked: text === 'true', disabled: true});
          }
        },
        {
          field: 'status',
          label: t('routes.flow.instances.graph.node.schema.status'),
          render: (text) => {
            return createVNode(FlowStatus, {status: text});
          }
        },
        {
          field: 'inputMappings',
          label: t('routes.flow.instances.graph.node.schema.input_mappings'),
          render: (text) => {
            function getBasicShortColumns(): BasicColumn[] {
              return [
                {
                  title: t('routes.flow.instances.graph.node.schema.input_mappings_source'),
                  dataIndex: 'source',
                },
                {
                  title: t('routes.flow.instances.graph.node.schema.input_mappings_target'),
                  dataIndex: 'target',
                }
              ];
            }

            let result = text !== undefined ? JSON.parse(text) : {}
            const data: any = []

            for (const key in result) {
              data.push({
                "source": result[key].source,
                "target": result[key].target,
              })
            }
            return createVNode(BasicTable, {
              showIndexColumn: false,
              canResize: false,
              columns: getBasicShortColumns(),
              dataSource: data,
              pagination: false
            }, {default: () => data});
          }
        },
        {
          field: 'outputMappings',
          label: t('routes.flow.instances.graph.node.schema.output_mappings'),
          render: (text) => {
            function getBasicShortColumns(): BasicColumn[] {
              return [
                {
                  title: t('routes.flow.instances.graph.node.schema.output_mappings_source'),
                  dataIndex: 'source',
                },
                {
                  title: t('routes.flow.instances.graph.node.schema.output_mappings_target'),
                  dataIndex: 'target',
                }
              ];
            }

            let result = text !== undefined ? JSON.parse(text) : {}
            const data: any = []

            for (const key in result) {
              data.push({
                "source": result[key].source,
                "target": result[key].target,
              })
            }
            return createVNode(BasicTable, {
              showIndexColumn: false,
              canResize: false,
              columns: getBasicShortColumns(),
              dataSource: data,
              pagination: false
            }, {default: () => data});
          }
        },
        {
          field: 'interruptions',
          label: t('routes.flow.instances.graph.node.schema.interruptions'),
          render: (text) => {
            function getBasicShortColumns(): BasicColumn[] {
              return [
                {
                  title: t('routes.flow.instances.graph.node.schema.interruptions_key'),
                  dataIndex: 'value',
                }
              ];
            }

            let result = text !== undefined ? JSON.parse(text) : {}
            const data: any = []
            for (const key in result) {
              data.push({
                "value": result[key],
              })
            }
            return createVNode(BasicTable, {
              showIndexColumn: false,
              canResize: false,
              columns: getBasicShortColumns(),
              dataSource: data,
              pagination: false
            }, {default: () => data});
          }
        },
        {
          field: 'timeline',
          label: t('routes.flow.instances.graph.node.schema.timeline'),
          render: (text) => {
            function getBasicShortColumns(): BasicColumn[] {
              return [
                {
                  title: t('routes.flow.instances.graph.node.schema.timeline_key'),
                  dataIndex: 'key',
                },
                {
                  title: t('routes.flow.instances.graph.node.schema.timeline_value'),
                  dataIndex: 'value',
                }
              ];
            }

            let result = text !== undefined ? JSON.parse(text) : {}
            const data: any = []

            for (const key in result) {
              data.push({
                "key": key,
                "value": result[key],
              })
            }
            return createVNode(BasicTable, {
              showIndexColumn: false,
              canResize: false,
              columns: getBasicShortColumns(),
              dataSource: data,
              pagination: false
            }, {default: () => data});
          }
        },
        {
          field: 'conditions',
          label: t('routes.flow.instances.graph.node.schema.conditions'),
          render: (text) => {
            function getBasicShortColumns(): BasicColumn[] {
              return [
                {
                  title: t('routes.flow.instances.graph.node.schema.conditions_key'),
                  dataIndex: 'value',
                }
              ];
            }

            let result = text !== undefined ? JSON.parse(text) : {}
            const data: any = []
            for (const key in result) {
              data.push({
                "value": result[key],
              })
            }
            return createVNode(BasicTable, {
              showIndexColumn: false,
              canResize: false,
              columns: getBasicShortColumns(),
              dataSource: data,
              pagination: false
            }, {default: () => data});
          }
        }
      ];
      break;
    case RILL_CATEGORY.CHOICE:
      return [
        {
          field: 'name',
          label: t('routes.flow.instances.graph.node.schema.name'),
          render: (text) => {
            return createVNode(Typography.Paragraph, {underline: true}, {default: () => text});
          }
        },
        {
          field: 'category',
          label: t('routes.flow.instances.graph.node.schema.category'),
          render: commonTagRender("blue")
        },
        {
          field: 'tolerance',
          label: t('routes.flow.instances.graph.node.schema.tolerance'),
          render: (text) => {
            return createVNode(Switch, {checked: text === 'true', disabled: true});
          }
        },
        {
          field: 'status',
          label: t('routes.flow.instances.graph.node.schema.status'),
          render: (text) => {
            return createVNode(FlowStatus, {status: text});
          }
        },
        {
          field: 'inputMappings',
          label: t('routes.flow.instances.graph.node.schema.input_mappings'),
          render: (text) => {
            function getBasicShortColumns(): BasicColumn[] {
              return [
                {
                  title: t('routes.flow.instances.graph.node.schema.input_mappings_source'),
                  dataIndex: 'source',
                },
                {
                  title: t('routes.flow.instances.graph.node.schema.input_mappings_target'),
                  dataIndex: 'target',
                }
              ];
            }

            let result = text !== undefined ? JSON.parse(text) : {}
            const data: any = []

            for (const key in result) {
              data.push({
                "source": result[key].source,
                "target": result[key].target,
              })
            }
            return createVNode(BasicTable, {
              showIndexColumn: false,
              canResize: false,
              columns: getBasicShortColumns(),
              dataSource: data,
              pagination: false
            }, {default: () => data});
          }
        },
        {
          field: 'outputMappings',
          label: t('routes.flow.instances.graph.node.schema.output_mappings'),
          render: (text) => {
            function getBasicShortColumns(): BasicColumn[] {
              return [
                {
                  title: t('routes.flow.instances.graph.node.schema.output_mappings_source'),
                  dataIndex: 'source',
                },
                {
                  title: t('routes.flow.instances.graph.node.schema.output_mappings_target'),
                  dataIndex: 'target',
                }
              ];
            }

            let result = text !== undefined ? JSON.parse(text) : {}
            const data: any = []

            for (const key in result) {
              data.push({
                "source": result[key].source,
                "target": result[key].target,
              })
            }
            return createVNode(BasicTable, {
              showIndexColumn: false,
              canResize: false,
              columns: getBasicShortColumns(),
              dataSource: data,
              pagination: false
            }, {default: () => data});
          }
        },
      ];
      break;
    default:
      return [
        {
          field: 'name',
          label: t('routes.flow.instances.graph.node.schema.name'),
          render: (text) => {
            return createVNode(Typography.Paragraph, {underline: true}, {default: () => text});
          }
        },
        {
          field: 'resourceProtocol',
          label: t('routes.flow.instances.graph.node.schema.resource_protocol'),
          render: commonTagRender("blue")
        },
        {
          field: 'resourceName',
          label: t('routes.flow.instances.graph.node.schema.resource_name'),
          render: (text) => {
            return createVNode(Typography.Paragraph, {underline: true}, {default: () => text});
          }
        },
        {
          field: 'pattern',
          label: t('routes.flow.instances.graph.node.schema.pattern'),
          render: (text) => {
            return createVNode(Switch, {checked: text === 'task_sync', disabled: true});
          }
        },
        {
          field: 'tolerance',
          label: t('routes.flow.instances.graph.node.schema.tolerance'),
          render: (text) => {
            return createVNode(Switch, {checked: text === 'true', disabled: true});
          }
        },
        {
          field: 'start_time',
          label: t('routes.flow.instances.graph.node.schema.start_time'),
        },
        {
          field: 'end_time',
          label: t('routes.flow.instances.graph.node.schema.end_time'),
        },
        {
          field: 'status',
          label: t('routes.flow.instances.graph.node.schema.status'),
          render: (text) => {
            return createVNode(FlowStatus, {status: text});
          }
        },
        {
          field: 'inputMsg',
          label: t('routes.flow.instances.graph.node.schema.input_msg'),
          render: (text) => {
            function getBasicShortColumns(): BasicColumn[] {
              return [
                {
                  title: t('routes.flow.instances.graph.node.schema.input_msg_key'),
                  dataIndex: 'key',
                },
                {
                  title: t('routes.flow.instances.graph.node.schema.input_msg_value'),
                  dataIndex: 'value',
                }
              ];
            }

            let result = text !== undefined ? JSON.parse(text) : {}
            const data: any = []
            for (const key in result) {
              data.push({
                "key": key,
                "value": typeof result[key] === 'string' ? result[key] : JSON.stringify(result[key])
              })
            }
            return createVNode(BasicTable, {
              showIndexColumn: false,
              canResize: false,
              columns: getBasicShortColumns(),
              dataSource: data,
              pagination: false
            }, {default: () => data});
          }
        },
        {
          field: 'outputMsg',
          label: t('routes.flow.instances.graph.node.schema.output_msg'),
          render: (text) => {
            function getBasicShortColumns(): BasicColumn[] {
              return [
                {
                  title: t('routes.flow.instances.graph.node.schema.output_msg_key'),
                  dataIndex: 'key',
                },
                {
                  title: t('routes.flow.instances.graph.node.schema.output_msg_value'),
                  dataIndex: 'value',
                }
              ];
            }

            let result = text !== undefined ? JSON.parse(text) : {}
            const data: any = []
            for (const key in result) {
              data.push({
                "key": key,
                "value": typeof result[key] === 'string' ? result[key] : JSON.stringify(result[key])
              })
            }
            return createVNode(BasicTable, {
              showIndexColumn: false,
              canResize: false,
              columns: getBasicShortColumns(),
              dataSource: data,
              pagination: false
            }, {default: () => data});
          }
        },
        {
          field: 'result',
          label: t('routes.flow.instances.graph.node.schema.error_result_msg'),
          render: (text) => {
            return createVNode(BlockText, {context: text}, {default: () => text});
          }
        },
        {
          field: 'inputMappings',
          label: t('routes.flow.instances.graph.node.schema.input_mappings'),
          render: (text) => {
            function getBasicShortColumns(): BasicColumn[] {
              return [
                {
                  title: t('routes.flow.instances.graph.node.schema.input_mappings_source'),
                  dataIndex: 'source',
                },
                {
                  title: t('routes.flow.instances.graph.node.schema.input_mappings_target'),
                  dataIndex: 'target',
                }
              ];
            }

            let result = text !== undefined ? JSON.parse(text) : {}
            const data: any = []

            for (const key in result) {
              data.push({
                "source": result[key].source,
                "target": result[key].target,
              })
            }
            return createVNode(BasicTable, {
              showIndexColumn: false,
              canResize: false,
              columns: getBasicShortColumns(),
              dataSource: data,
              pagination: false
            }, {default: () => data});
          }
        },
        {
          field: 'outputMappings',
          label: t('routes.flow.instances.graph.node.schema.output_mappings'),
          render: (text) => {
            function getBasicShortColumns(): BasicColumn[] {
              return [
                {
                  title: t('routes.flow.instances.graph.node.schema.output_mappings_source'),
                  dataIndex: 'source',
                },
                {
                  title: t('routes.flow.instances.graph.node.schema.output_mappings_target'),
                  dataIndex: 'target',
                }
              ];
            }

            let result = text !== undefined ? JSON.parse(text) : {}
            const data: any = []

            for (const key in result) {
              data.push({
                "source": result[key].source,
                "target": result[key].target,
              })
            }
            return createVNode(BasicTable, {
              showIndexColumn: false,
              canResize: false,
              columns: getBasicShortColumns(),
              dataSource: data,
              pagination: false
            }, {default: () => data});
          }
        },
      ];
  }
}

</script>
