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
                  // onClick: handleEdit.bind(null, record)
                },
              ]"
          :dropDownActions="[]"
        />
      </template>
    </template>
  </BasicTable>
</template>
<script lang="ts">
import { defineComponent } from 'vue';
import {BasicTable, TableAction, useTable} from '/@/components/Table';
import { getBasicColumns, getFormConfig } from './tableData';
import { Alert } from 'ant-design-vue';

import {templateListApi} from "@/api/table";

export default defineComponent({
  components: {TableAction, BasicTable, AAlert: Alert },
  setup() {
    // const checkedKeys = ref<Array<string | number>>([]);
    const [registerTable, { getForm }] = useTable({
      title: '开启搜索区域',
      // api: demoListApi,
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

    function getFormValues() {
      console.log(getForm().getFieldsValue());
    }

    return {
      registerTable,
    };
  },
});

function handleEdit(record: Recordable) {
  console.log('点击了编辑', record);
}
</script>
