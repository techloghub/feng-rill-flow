<template>
  <BasicModal
    v-bind="$attrs"
    @register="register"
    :title="t('routes.flow.definitions.modal.title')"
    width="1000px"
    :showOkBtn="false"
    :showCancelBtn="false"
  >
    <BasicTable
      :columns="getBasicColumns()"
      :dataSource="versions"
      :pagination="false"
      :showIndexColumn="false"
      :actionColumn="getActionColumn()"
    >
      <template #bodyCell="{ column, record }">
        <template v-if="column.key === 'action'">
          <TableAction
            :actions="[
              {
                label: '详情',
                onClick: handleEdit.bind(null, record, column),
              },
            ]"
          />
        </template>
      </template>
    </BasicTable>
  </BasicModal>
</template>
<script lang="ts" setup>
import {ref} from 'vue';
import { BasicModal, useModalInner } from '/@/components/Modal';
import {BasicTable, BasicColumn, TableAction} from '/@/components/Table';
import {useI18n} from "@/hooks/web/useI18n";
import {useGo} from "@/hooks/web/usePage";
const {t} = useI18n();
const go = useGo();


const versions = ref([]);
const [register] = useModalInner((data) => {
  versions.value = data.versions
});


function getBasicColumns(): BasicColumn[] {
  const formatDate = (timestamp) => {
    const date = new Date(timestamp.value);
    return date.toLocaleString();
  };
  return [
    {
      title: t('routes.flow.definitions.modal.columns.create_time'),
      dataIndex: 'create_time',
      fixed: 'left',
      width: 200,
      customRender: formatDate,
    },
    {
      title: t('routes.flow.definitions.modal.columns.descriptor_id'),
      dataIndex: 'descriptor_id',
    },
  ];
}

function getActionColumn() {
  return {
    width: 250,
    title: t('routes.flow.definitions.opt'),
    dataIndex: 'action',
  };
}

function handleEdit(record: Recordable) {
  go({
    "path": "/flow-definition/detail",
    "query": {
      "descriptor_id": record.descriptor_id
    }
  });
}

</script>

