<template>
  <BasicModal
    v-bind="$attrs"
    @register="register"
    :title="t('routes.flow.definitions.modal.title')"
    width="1000px"
    :showOkBtn="false"
    :showCancelBtn="false"
  >
    <CodeEditor v-model:value="flowDetail" :mode="modeValue" readonly="true" />
  </BasicModal>
</template>
<script lang="ts" setup>
import {ref} from 'vue';
import { BasicModal, useModalInner } from '/@/components/Modal';
import {BasicTable, BasicColumn, TableAction} from '/@/components/Table';
import {useI18n} from "@/hooks/web/useI18n";
import {useGo} from "@/hooks/web/usePage";
import {MODE} from "@/components/CodeEditor";
import { CodeEditor } from '/@/components/CodeEditor';

const {t} = useI18n();
const go = useGo();

const modeValue = ref<MODE>(MODE.YAML);
const flowDetail = ref();
const [register] = useModalInner((data) => {
  console.log("xxxxxxxxx useModalInner", data)
  flowDetail.value = data.data.descriptor
});


</script>

