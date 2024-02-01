<template>
  <BasicTable @register="registerTable">
    <template #bodyCell="{ column, record }">
      <template v-if="column.key === 'action'">
        <TableAction
          stopButtonPropagation
          :actions="[
                {
                  label: '编辑',
                  ifShow: (_action) => {
                    return record.node_type !== 'meta';
                  },
                  onClick: handleEdit.bind(null, record)
                },
              ]"
          :dropDownActions="[]"
        />
      </template>
    </template>
  </BasicTable>
  <NodeTemplateModal @register="templateRegister" :minHeight="100" />
</template>
<script lang="ts">
import { defineComponent } from 'vue';
import {BasicTable, TableAction, useTable} from '/@/components/Table';
import { getBasicColumns, getFormConfig } from './tableData';
import {Alert, Modal} from 'ant-design-vue';

import {templateListApi} from "@/api/table";
import {useModal} from "@/components/Modal";
import NodeTemplateModal from "@/views/flow-definition/node-templetes/NodeTemplateModal.vue";

export default defineComponent({
  components: {TableAction, BasicTable, AAlert: Alert, Modal, NodeTemplateModal },
  setup() {
    const [templateRegister, { openModal: openTemplateModal }] = useModal();
    const [registerTable, {  }] = useTable({
      title: '开启搜索区域',
      api: templateListApi,
      fetchSetting: {
        listField: "data"
      },
      columns: getBasicColumns(),
      useSearchForm: true,
      formConfig: getFormConfig(),
      showTableSetting: true,
      tableSetting: { fullScreen: true },
      showIndexColumn: false,
      rowKey: 'name',
      actionColumn: {
        width: 100,
        title: '操作',
        dataIndex: 'action',
        fixed: 'right',
      },
    });

    function handleEdit(record: Recordable) {
      openTemplateModal(true);
    }

    return {
      registerTable,
      handleEdit,
      templateRegister,
    };
  },
});
</script>
