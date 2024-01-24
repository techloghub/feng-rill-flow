<template>
  <BasicModal
    v-bind="$attrs"
    title="Modal Title"
    :helpMessage="['提示1', '提示2']"
    @register="registerModal"
    @ok="handleOk"
  >
    <div  v-if="!jsonSchemaFormType">
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
        <template ></template>
      </BasicTree>

    </div>

  </BasicModal>

</template>
<script lang="ts" setup>
import {h, inject, onMounted, ref, Ref, shallowRef} from "vue";
import { useI18n } from '/@/hooks/web/useI18n';
import { BasicForm, FormSchema, useForm } from '/@/components/Form/index';
import VueForm from '@lljj/vue3-form-ant';
import { BasicTree, TreeActionType, TreeItem } from '/@/components/Tree/index';
const { t } = useI18n();
const showNodeEditModal: any = inject('showNodeEditModal');

import {BasicModal, useModalInner} from '/@/components/Modal';
import {Testwidget} from "@/components/Widget";
const componentRef = shallowRef(Testwidget);

const modelRef = ref({});
const cellRef = ref({});
const formSchemas: Ref<any | undefined> = ref([])
const jsonSchemaFormType = ref(false)
const schema = ref([]);
const jsonSchemaFormData = ref({"paramA" :{
    "reference": "s",
    "attr": "input",
    "input": "1"
  }
})
const [registerModal, { closeModal }] = useModalInner((cell) => {
  cellRef.value = cell
  console.log("useModalInner schemaInfo ", cell, cellRef.value)
  const data = cell.store.data.nodeDetailSchema?.node_type === 'meta' ?  cell.store.data.nodeDetailSchema.fields : cell.store.data.nodeDetailSchema?.schema
  schema.value = data

  const type = cell.store.data.nodeDetailSchema?.node_type ? cell.store.data.nodeDetailSchema.node_type : 'other'
  let schemaList = []
  if(type === 'meta') {
    jsonSchemaFormType.value = false
    for (const dataKey in data) {
      let item =  {
        field: dataKey,
        component: getComponentType(data[dataKey]),
        label: data[dataKey].name,
        rules: [{ required:  data[dataKey].required }],
      }
      schemaList.push(item)
      // console.log("dataKey", dataKey, data[dataKey].type,data[dataKey], item)
      formSchemas.value =  schemaList
    }
  } else if (type === 'template') {
    console.log("template====>", cell)
    jsonSchemaFormType.value = true
    formSchemas.value = data.schema
    // TODO formOutput 需要通过接口返回的output数据生成
  }


});

const [registerForm, { validate }] = useForm();

function getComponentType(item) {
  // console.log("item",item)
  if(item.type === 'boolean') {
    return 'Switch'
  }

  return 'Input'
}

const handleOk = () => {
  console.log("handleOk", jsonSchemaFormData.value, modelRef.value?.formModel)
  closeModal();
  showNodeEditModal.value = false
};

const treeData: TreeItem[] = [
  {
    title: 'statuses ',
    key: '0-0',
    children: [
      {
        title: 'visible',
        key: '0-0-0',
        children: [
          { title: 'type', key: '0-0-0-0' },
          { title: 'list_id', key: '0-0-0-1' },
        ],
      },
      {
        title: 'created_at',
        key: '0-0-1',
      },
      { title: 'id', key: '0-0-2' },
      { title: 'mid', key: '0-0-3' },
    ],
  }
];
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
      paramA : {
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
            "ui:widget": componentRef,
            'ui:treeData': [{"title":"parent11111","value":"parent1","children":[{"title":"parent 1-0","value":"parent 1-0","children":[{"title":"my leaf","value":"leaf1"},{"title":"your leaf","value":"leaf2"}]},{"title":"parent 1-1","value":"parent 1-1"}]}],
          },
        }
      }
    }
  }
});

</script>
