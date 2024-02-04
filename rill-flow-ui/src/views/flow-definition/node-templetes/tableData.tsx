import { FormProps } from '/@/components/Table';
import { BasicColumn } from '/@/components/Table/src/types/table';

export function getBasicColumns(): BasicColumn[] {
  return [
    {
      title: 'ID',
      dataIndex: 'id',
      fixed: 'left',
      width: 50
    },
    {
      title: '模板名称',
      dataIndex: 'name',
      width: 150
    },
    {
      title: '模板类型',
      dataIndex: 'type_str',
      width: 100,
    },
    {
      title: '节点类型',
      dataIndex: 'node_type',
      width: 100,
    },
    {
      title: 'category',
      dataIndex: 'category',
      width: 100,
    },
  ];
}
export function getFormConfig(): Partial<FormProps> {
  return {
    labelWidth: 100,
    schemas: [
      {
        field: 'id',
        label: 'id',
        component: 'Input',
        colProps: {
          xl: 3,
          xxl: 3,
        }
      }, {
        field: 'name',
        label: '模板名称',
        component: 'Input',
        colProps: {
          xl: 3,
          xxl: 5,
        }
      }, {
        field: 'type',
        label: '模板类型',
        component: 'Select',
        componentProps: {
          options: [
            { label: "函数模板", value: 0},
            { label: "插件模板", value: 1},
            { label: "逻辑模板", value: 2}
          ]
        },
        colProps: {
          xl: 3,
          xxl: 3,
        }
      }, {
        field: 'category',
        label: 'category',
        component: 'Select',
        componentProps: {
          options: [
            { label: "function", value: "function"},
            { label: "suspense", value: "suspense"},
            { label: "pass", value: "pass"},
            { label: "return", value: "return"},
            { label: "foreach", value: "foreach"},
          ]
        },
        colProps: {
          xl: 3,
          xxl: 3,
        }
      }, {
        field: 'node_type',
        label: '节点类型',
        component: 'Select',
        componentProps: {
          options: [
            { label: "元数据", value: "meta"},
            { label: "模板", value: "template"},
          ]
        },
        colProps: {
          xl: 3,
          xxl: 3,
        }
      }
    ],
  };
}
