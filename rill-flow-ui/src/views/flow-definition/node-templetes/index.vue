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
    <template #toolbar>
      <Tooltip>
        <template #title>
          <p>创建模板</p>
        </template>
        <a-button type="primary" @click="handleCreate()"> 创建模板 </a-button>
      </Tooltip>
    </template>
  </BasicTable>

  <TaskTemplateEditDrawer @register="registerTaskTemplateEditDrawer" @response="reloadPage" />
</template>
<script lang="ts">
import { defineComponent } from 'vue';
import {BasicTable, TableAction, useTable} from '/@/components/Table';
import { getBasicColumns, getFormConfig } from './tableData';
import {Drawer} from 'ant-design-vue';

import {templateListApi} from "@/api/table";
import TaskTemplateEditDrawer
  from "@/views/flow-definition/node-templetes/taskTemplateEditDrawer.vue";
import {useDrawer} from "@/components/Drawer";

export default defineComponent({
  components: {TableAction, BasicTable, Drawer, TaskTemplateEditDrawer },
  setup() {
    const [registerTable, { reload }] = useTable({
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

    const [registerTaskTemplateEditDrawer, { openDrawer }] = useDrawer();

    function handleEdit(record: Recordable) {
      openDrawer(true, {
        action: "update",
        ...record
      })
    }

    function handleCreate() {
      openDrawer(true, {
        action: "create"
      })
    }

    function reloadPage() {
      reload()
    }

    return {
      registerTaskTemplateEditDrawer,
      registerTable,
      handleEdit,
      handleCreate,
      reloadPage
    };
  },
});
</script>
