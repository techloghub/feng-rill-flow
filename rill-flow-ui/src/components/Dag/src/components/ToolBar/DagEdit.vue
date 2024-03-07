<template>
  <BasicModal
    v-bind="$attrs"
    destroyOnClose
    @register="register"
    title="流程基本信息编辑"
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
  import { useMessage } from "@/hooks/web/useMessage";
  const form = ref();
  form.value = createForm();

  const formStep = ref();
  formStep.value = FormStep.createFormStep();
  const { createMessage } = useMessage();

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
  const {dagMeta } = storeToRefs(provideGraph);
  const { setDagMeta, setDagMetaInputSchema } = provideGraph;

  const schema = ref({});
  schema.value = {
    "type": "object",
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
    }
  }

  const [register, { closeModal }] = useModalInner((data) => {
    console.log('DagEdit inner', data);

    form.value.setFormState((state) => {
      state.values['workspace'] = dagMeta.value?.workspace;
      state.values['dagName'] = dagMeta.value?.dagName;
      state.values['alias'] = dagMeta.value?.alias;
    })
  });

  const handleOk = () => {
    //更新普通节点中的数据
    setDagMeta(new DagMetaInfo(form.value.getFormState().values.workspace, form.value.getFormState().values.dagName, 'flow', '1.0.0', '{}', form.value.getFormState().values.alias, ''));
    console.log('handleOk', form.value.getFormState().values, dagMeta.value);
    createMessage.success('已保存到本地');
    closeModal();
  };

</script>
