<template>
  <BasicTable @register="registerTable1">
    <template #bodyCell="{ column, record }">
      <template v-if="column.key === 'status'">
        <FlowStatus :status="record.status"/>
      </template>
      <template v-if="column.key === 'action'">
        <TableAction
          stopButtonPropagation
          :actions="[
              {
                label: t('routes.flow.instances.option.detail'),
                onClick: handleDetail.bind(null, record)
              },
              {
                label: t('routes.flow.definitions.option.versions'),
                onClick: handleVersion.bind(null, record)
              },
              {
                label: t('routes.flow.definitions.option.showYaml'),
                onClick: handleShowYaml.bind(null, record)
              },
            ]"
          :dropDownActions="[]"
        />
        <Versions @register="register"/>
        <FlowDetail @register="register1"/>
      </template>
    </template>
    <template #toolbar>
      <Tooltip>
        <template #title>
          <p>新建</p>
        </template>
        <a-button type="primary" @click="handleCreate()"> 新建 </a-button>
      </Tooltip>
    </template>

  </BasicTable>
</template>
<script lang="ts" setup>
import {BasicTable, useTable, TableAction} from '/@/components/Table';
import {getInstanceColumns, getFormConfig} from './methods';
import FlowStatus from "@/components/Dag/src/components/Templates/FlowStatus.vue";

import {definitionListApi, getFlowDetailApi, getFlowVersionsApi} from '@/api/table';
import {useGo} from "@/hooks/web/usePage";
import {useI18n} from '/@/hooks/web/useI18n';
import {useModal} from "@/components/Modal";
import Versions from './Versions.vue';
import FlowDetail from "@/views/flow-definition/FlowDetail.vue";
import { Tooltip } from "ant-design-vue";
const {t} = useI18n();
const go = useGo();

const [registerTable1] = useTable({
  title: t('routes.flow.definitions.list'),
  api: definitionListApi,
  columns: getInstanceColumns(),
  useSearchForm: true,
  formConfig: getFormConfig(),
  showTableSetting: false,
  tableSetting: {fullScreen: true},
  showIndexColumn: false,
  rowKey: 'descriptor_id',
  actionColumn: {
    width: 100,
    title: t('routes.flow.instances.opt'),
    dataIndex: 'action',
    fixed: 'right',
  },
});

function handleDetail(record: Recordable) {
  go({
    "path": "/flow-definition/detail",
    "query": {
      "descriptor_id": record.descriptor_id,
    }
  });
}
function handleCreate() {
  go({
    "path": "/flow-definition/detail",
    "query": {
      "type": 'create',
    }
  });
}


const [register, {openModal: openModal}] = useModal();
const [register1, {openModal: openModal1}] = useModal();
function handleVersion(record: Recordable) {

  getFlowVersionsApi({
    business_id: record.business_id,
    feature_name: record.feature_id,
    alias: record.alia,
  }).then((result) => {
    openModal(true, {
      feature: result.feature,
      alias: result.alias,
      business_id: result.business_id,
      versions: result.versions
    })
  })

}

function handleShowYaml(record: Recordable) {

  getFlowDetailApi({
    descriptor_id: record.descriptor_id,
  }).then((result) => {
    openModal1(true, {
      data: result
    })
  })

}


</script>
