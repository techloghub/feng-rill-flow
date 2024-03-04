<template>
  <BasicModal
    v-bind="$attrs"
    destroyOnClose
    @register="register"
    title="预览 jsonSchema"
  >
    <VueForm
      :formData="formData"
      :schema="templateSchema"
      :formProps="formProps"
    >
      <div slot-scope="{}"/>
    </VueForm>
  </BasicModal>
</template>
<script lang="ts" setup>
import { BasicModal, useModalInner } from '@/components/Modal';
import VueForm from "@lljj/vue3-form-ant";
import {ref} from "vue";
import {templateSchema} from "@/views/flow-definition/node-templetes/tableData";

const [register] = useModalInner();

const formData = {};
const formProps = ref();
formProps.value = {
  labelPosition: 'right',
  labelSuffix: '：',
  hideSave: true,
  hideCancel: true,
};
</script>
