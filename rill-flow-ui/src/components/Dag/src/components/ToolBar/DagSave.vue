<template>
  <BasicModal
    v-bind="$attrs"
    destroyOnClose
    @register="register"
    title="详情"
    width="70%"
    :showOkBtn="false"
    :showCancelBtn="false"
  >
    <FormProvider :form="form">
      <SchemaField :schema="schema" :scope="{ formStep }"  />
      <FormConsumer>
        <template #default>
          <FormButtonGroup>
            <Button
              :disabled="!formStep.allowBack"
              @click="
              () => {
                formStep.back()
              }
            "
            >
              上一步
            </Button>
            <Button
              :disabled="!formStep.allowNext"
              @click="
              () => {
                formStep.next()
              }
            "
            >
              下一步
            </Button>
            <Submit :disabled="formStep.allowNext" @submit="handleOk">提交</Submit>
          </FormButtonGroup>
        </template>
      </FormConsumer>
    </FormProvider>

  </BasicModal>
</template>
<script lang="ts" setup>
  import { ref } from 'vue';
  import { BasicModal, useModalInner } from '/@/components/Modal';
  import {Button} from "ant-design-vue";
  import {
    ArrayItems,
    DatePicker,
    FormButtonGroup, FormCollapse,
    FormItem,
    FormStep,
    Input, InputNumber,
    Select,
    Space,
    Submit, Switch, PreviewText,
  } from "@formily/antdv-x3";
  import {createSchemaField, FormConsumer, FormProvider} from "@formily/vue";
  import {createForm} from "@formily/core";
  import {useProvideGraph} from "@/components/Dag/src/store/graph";
  import {storeToRefs} from "pinia";
  import {getInputSchema} from "@/components/Dag/src/components/ToolBar/data";
  import {transferDagYaml} from "@/components/Dag/src/common/graphTransform";
  import { DagMetaInfo } from "@/components/Dag/src/models/global";
  const form = ref();
  form.value = createForm();

  const formStep = ref();
  formStep.value = FormStep.createFormStep();

  const { SchemaField } = createSchemaField({
    components: {
      FormItem,
      FormStep,
      Input,
      Space,
      Select,
      DatePicker,
      ArrayItems,
      Switch,
      InputNumber,
      FormCollapse,
      PreviewText,
    },
  })
  const provideGraph = useProvideGraph();
  const { graphRef, dagMeta } = storeToRefs(provideGraph);
  const { setDagMeta, setDagMetaInputSchema } = provideGraph;

  const schema = ref({});
  schema.value = {
    "type": "object",
    "properties": {
      collapse: {
        type: 'void',
        'x-component': 'FormStep',
        'x-component-props': {
          formStep: '{{formStep}}',
        },
        properties: {
          step1: {
            type: 'void',
            'x-component': 'FormStep.StepPane',
            'x-component-props': {
              title: '流程基本信息',
            },
            properties: {
              workspace: {
                type: 'string',
                title: '业务名称',
                required: true,
                disabled: true,
                'x-decorator': 'FormItem',
                'x-component': 'Input',
              },
              dagName: {
                type: 'string',
                title: '服务名称',
                required: true,
                'x-decorator': 'FormItem',
                'x-component': 'Input',
              },
              alias: {
                type: 'string',
                title: '别名',
                required: true,
                'x-decorator': 'FormItem',
                'x-component': 'Input',
              },
            },
          },
          step2: {
            type: 'void',
            'x-component': 'FormStep.StepPane',
            'x-component-props': {
              title: '第二步',
            },
            properties: getInputSchema(),
          },
          // step3: {
          //   type: 'void',
          //   'x-component': 'FormStep.StepPane',
          //   'x-component-props': {
          //     title: '第三步',
          //   },
          //   properties: {
          //     yaml: {
          //       type: 'string',
          //       title: 'yaml',
          //       'x-decorator': 'FormItem',
          //       'x-component': 'PreviewText.Input',
          //     },
          //   },
          // },
        },
      },
    }
  }
  const submitDag = ref();

  const [register, { closeModal }] = useModalInner((data) => {
    console.log('DagSave inner', data);
    submitDag.value = data.method;

    form.value.setFormState((state) => {
      state.values['workspace'] = dagMeta.value.workspace;
      state.values['dagName'] = dagMeta.value.dagName;
      state.values['alias'] = dagMeta.value.alias;
      state.values['inputSchema'] = JSON.parse(dagMeta.value.inputSchema);
      state.values['yaml'] = transferDagYaml(graphRef.value, dagMeta.value);
    })
  });

  const handleOk = () => {
    //更新普通节点中的数据
    setDagMeta(new DagMetaInfo(form.value.getFormState().values.workspace, form.value.getFormState().values.dagName, 'flow', '1.0.0', form.value.getFormState().values.inputSchema, form.value.getFormState().values.alias, ''));
    setDagMetaInputSchema(form.value.getFormState().values.inputSchema);
    let yamlData = transferDagYaml(graphRef.value, dagMeta.value);
    console.log('handleOk', form.value.getFormState().values, dagMeta.value);

    submitDag.value({
        business_id: dagMeta.value.workspace,
        feature_name: dagMeta.value.dagName,
        alias: dagMeta.value?.alias,
      },
      yamlData
    );
    closeModal();
  };

</script>
