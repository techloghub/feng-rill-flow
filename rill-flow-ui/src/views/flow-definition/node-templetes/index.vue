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
                {
                  label: '禁用',
                  ifShow: (_action) => {
                    return record.node_type !== 'meta' && record.enable === 1;
                  },
                  onClick: handleEnableDisable.bind(null, record.id, false)
                },
                {
                  label: '启用',
                  ifShow: (_action) => {
                    return record.node_type !== 'meta' && record.enable === 0;
                  },
                  onClick: handleEnableDisable.bind(null, record.id, true)
                }
              ]"
          :dropDownActions="[]"
        />
        <TaskTemplateEditDrawer @register="registerTaskTemplateEditDrawer" @response="reloadPage" />
      </template>
    </template>
    <template #enable="{ record }">
      {{ record.enable === 1 ? '启用' : '禁用' }}
    </template>
    <template #node_type="{ record }">
      {{ record.node_type === 'meta' ? '元数据' : '模板' }}
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

</template>
<script lang="ts">
import { defineComponent } from 'vue';
import {BasicTable, TableAction, useTable} from '/@/components/Table';
import { getBasicColumns, getFormConfig } from './tableData';
import {Drawer, Tooltip} from 'ant-design-vue';

import {
  disableTemplateApi, enableTemplateApi, templateListApi,
} from "@/api/table";
import TaskTemplateEditDrawer
  from "@/views/flow-definition/node-templetes/taskTemplateEditDrawer.vue";
import {useDrawer} from "@/components/Drawer";

export default defineComponent({
  components: {TableAction, BasicTable, Drawer, TaskTemplateEditDrawer, Tooltip },
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

    async function handleEnableDisable(id, enable) {
      let res;
      if (enable) {
        res = await enableTemplateApi(id);
      } else {
        res = await disableTemplateApi(id);
      }
      console.log(res);
      reloadPage();
    }

    function reloadPage() {
      reload()
    }

    return {
      registerTaskTemplateEditDrawer,
      registerTable,
      handleEdit,
      handleCreate,
      handleEnableDisable,
      reloadPage,
    };
  },
});
</script>
