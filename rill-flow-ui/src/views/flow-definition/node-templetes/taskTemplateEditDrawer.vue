<template>
  <BasicDrawer
    v-bind="$attrs"
    @register="registerDrawer"
    showFooter
    title="编辑任务模板"
    width="400"
    @ok="handleSubmit"
  >
    <BasicForm @register="registerForm" autoFocusFirstItem :actionColOptions="{ span: 24 }" />
  </BasicDrawer>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import { BasicDrawer, useDrawerInner } from '/@/components/Drawer';
import {useForm, BasicForm} from "@/components/Form";
import {updateTemplateListApi} from "@/api/table";

export default defineComponent({
  name: 'taskTemplateEditDrawer',
  components: {
    BasicDrawer,
    BasicForm,
  },
  setup(_, { }) {
    const formSchemas = [
      {
        field: 'id',
        component: 'Input',
        label: 'id',
        rules: [{ required: true }],
        componentProps: {
          disabled: true,
          visible: false
        },
      },
      {
        field: 'name',
        component: 'Input',
        label: '模板名称',
        rules: [{ required: true }],
      },
      {
        field: 'type',
        component: 'Select',
        label: '模板类型',
        componentProps: {
          options: [
            { label: "函数模板", value: 0},
            { label: "插件模板", value: 1},
            { label: "逻辑模板", value: 2}
          ],
          multiple: false,
          filterable: true
        },
      },
      {
        field: 'category',
        component: 'Input',
        label: 'category',
        rules: [{ required: true }],
      },
      {
        field: 'icon',
        component: 'InputTextArea',
        label: 'icon base64',
      }, {
        field: 'task_yaml',
        component: 'InputTextArea',
        label: '模板任务默认 yaml',
      }, {
        field: 'output',
        component: 'InputTextArea',
        label: '模板输出结构',
      }
    ]
    const [registerForm, { setFieldsValue, validateFields }] = useForm({
        layout: 'vertical',
        schemas: formSchemas,
        showResetButton: false,
        showSubmitButton: false,
        labelWidth: 140,
        baseColProps: { span: 24 },
      });

    const [registerDrawer, { }] = useDrawerInner(async (data) => {
      setFieldsValue(data)
    });

    async function handleSubmit() {
      try {
        const res = await validateFields();
        updateTemplateListApi(res);
      } finally {
      }
    }

    return {
      registerDrawer,
      handleSubmit,
      registerForm,
    };
  }

})
</script>
