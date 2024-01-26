<template>
  <BasicTable @register="registerTable">
    <template #form-custom> custom-slot </template>
<!--    <template #toolbar>-->
<!--      <a-button type="primary" @click="getFormValues">获取表单数据</a-button>-->
<!--    </template>-->
  </BasicTable>
</template>
<script lang="ts">
import { defineComponent } from 'vue';
import { BasicTable, useTable } from '/@/components/Table';
import { getBasicColumns, getFormConfig } from './tableData';
import { Alert } from 'ant-design-vue';

import {templateListApi} from "@/api/table";

export default defineComponent({
  components: { BasicTable, AAlert: Alert },
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
      // rowSelection: {
      //   type: 'checkbox',
      //   selectedRowKeys: checkedKeys,
      //   onSelect: onSelect,
      //   onSelectAll: onSelectAll,
      // },
    });

    function getFormValues() {
      console.log(getForm().getFieldsValue());
    }

    // function onSelect(record, selected) {
    //   if (selected) {
    //     checkedKeys.value = [...checkedKeys.value, record.id];
    //   } else {
    //     checkedKeys.value = checkedKeys.value.filter((id) => id !== record.id);
    //   }
    // }
    // function onSelectAll(selected, selectedRows, changeRows) {
    //   const changeIds = changeRows.map((item) => item.id);
    //   if (selected) {
    //     checkedKeys.value = [...checkedKeys.value, ...changeIds];
    //   } else {
    //     checkedKeys.value = checkedKeys.value.filter((id) => {
    //       return !changeIds.includes(id);
    //     });
    //   }
    // }

    return {
      registerTable,
      getFormValues,
      // checkedKeys,
      // onSelect,
      // onSelectAll,
    };
  },
});
</script>
