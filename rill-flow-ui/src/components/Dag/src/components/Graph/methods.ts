export const getJsonSchema = (rule) => {
  // console.log("rule:", rule, rule.data)

  if (rule.type === 'object' && rule.data === undefined) {
    return {
      type: 'void',
      title: rule.name,
      required: rule.required,
      'x-decorator': 'FormItem',
      'x-component': 'FormCollapse',
      'x-component-props': {
        formCollapse: '{{formCollapse}}',
      },
      properties: {
        retry: {
          type: 'void',
          'x-component': 'FormCollapse.CollapsePanel',
          // 'x-component-props': {
          //   header: '任务重试设置',
          // },
          properties: {
            max_retry_times: {
              type: 'string',
              title: '最大重试次数',
              'x-decorator': 'FormItem',
              required: true,
              'x-component': 'InputNumber',
            },
            interval_in_seconds: {
              type: 'string',
              title: '间隔时间',
              'x-decorator': 'FormItem',
              required: true,
              'x-component': 'InputNumber',
            },
            multiplier: {
              type: 'string',
              title: '放大系数',
              'x-decorator': 'FormItem',
              required: true,
              'x-component': 'InputNumber',
            },
          },
        },
      },
    };
  }

  if (rule.data && rule.data.type === 'object') {
    for (const optionsKey in rule.data) {
      // TODO inputMapping
      // console.log("getJsonSchema ", optionsKey, rule.data[optionsKey])
    }

    return {
      type: 'array',
      'x-component': 'ArrayItems',
      'x-decorator': 'FormItem',
      title: rule.name,
      required: rule.required,
      items: {
        type: 'object',
        properties: {
          space: {
            type: 'void',
            'x-component': 'Space',
            properties: {
              sort: {
                type: 'void',
                'x-decorator': 'FormItem',
                'x-component': 'ArrayItems.SortHandle',
              },
              // date: {
              //   type: 'string',
              //   title: '日期',
              //   'x-decorator': 'FormItem',
              //   'x-component': 'DatePicker',
              //   'x-component-props': {
              //     type: 'daterange',
              //     style: {
              //       width: '250px',
              //     },
              //   },
              // },
              source: {
                type: 'string',
                title: '输入来源',
                'x-decorator': 'FormItem',
                'x-component': 'Input',
              },
              target: {
                type: 'string',
                title: '输入目标',
                'x-decorator': 'FormItem',
                'x-component': 'Input',
              },
              // select: {
              //   type: 'string',
              //   title: '下拉框',
              //   enum: [
              //     { label: '选项1', value: 1 },
              //     { label: '选项2', value: 2 },
              //   ],
              //   'x-decorator': 'FormItem',
              //   'x-component': 'Select',
              //   'x-component-props': {
              //     style: {
              //       width: '250px',
              //     },
              //   },
              // },
              remove: {
                type: 'void',
                'x-decorator': 'FormItem',
                'x-component': 'ArrayItems.Remove',
              },
            },
          },
        },
      },
      properties: {
        add: {
          type: 'void',
          title: '添加' + rule.name,
          'x-component': 'ArrayItems.Addition',
        },
      },
    };
  }

  if (rule.data && rule.data.type === 'string') {
    for (const optionsKey in rule.data) {
      // TODO 失败条件
      // console.log("getJsonSchema ", optionsKey, rule.data[optionsKey])
    }

    return {
      type: 'array',
      'x-component': 'ArrayItems',
      'x-decorator': 'FormItem',
      required: rule.required,
      title: rule.name,
      items: {
        type: 'void',
        'x-component': 'Space',
        properties: {
          sort: {
            type: 'void',
            'x-decorator': 'FormItem',
            'x-component': 'ArrayItems.SortHandle',
          },
          input: {
            type: 'string',
            'x-decorator': 'FormItem',
            'x-component': 'Input',
          },
          remove: {
            type: 'void',
            'x-decorator': 'FormItem',
            'x-component': 'ArrayItems.Remove',
          },
        },
      },
      properties: {
        add: {
          type: 'void',
          title: '添加' + rule.name,
          'x-component': 'ArrayItems.Addition',
        },
      },
    };
  }

  if (rule.options) {
    const item = {
      type: 'string',
      title: rule.name,
      required: rule.required,
      enum: [
        {
          label: '选项1',
          value: 1,
        },
        {
          label: '选项2',
          value: 2,
        },
      ],
      'x-decorator': 'FormItem',
      'x-component': 'Select',
      'x-component-props': {
        style: 'width: 240px;',
      },
    };
    const options = rule.options;
    const enums = [];
    for (const optionsKey in options) {
      enums.push({ label: options[optionsKey].name, value: options[optionsKey].value });
    }
    item.enum = enums;
    return item;
  }

  if (rule.type === 'boolean') {
    return {
      type: 'boolean',
      title: rule.name,
      required: rule.required,
      'x-decorator': 'FormItem',
      'x-component': 'Switch',
    };
  }

  return {
    type: 'string',
    title: rule.name,
    required: rule.required,
    'x-decorator': 'FormItem',
    'x-component': 'Input',
  };
};
export const getJsonData = (data) => {
  return data;
};

export const convertJSON = (json) => {
  function traverse(obj, parentKey = '') {
    const result = [];

    if (Array.isArray(obj)) {
      obj.forEach((item, index) => {
        const key = parentKey ? `${parentKey}-${index}` : `${index}`;
        const title = `item ${index}`;
        const children = traverse(item, key);

        result.push({ title, key, children });
      });
    } else if (typeof obj === 'object') {
      Object.keys(obj).forEach((key, index) => {
        const currentKey = parentKey ? `${parentKey}-${index}` : `${index}`;
        const currentTitle = key;

        if (typeof obj[key] === 'object') {
          const currentChildren = traverse(obj[key], currentKey);

          result.push({ title: currentTitle, key: currentKey, children: currentChildren });
        } else {
          result.push({ title: currentTitle, key: currentKey });
        }
      });
    }

    return result;
  }

  return traverse(json);
};

export const getGraphNodeTemplateReferenceMap = (tasks) => {
  console.log('graph props dagRefererce', tasks);

  return {
    node1: [
      {
        title: 'statuses',
        value: 'statuses',
        children: [
          {
            title: 'visible',
            value: 'visible',
            children: [
              {
                title: 'type',
                value: 'type',
              },
              {
                title: 'list_id',
                value: 'list_id',
              },
            ],
          },
          {
            title: 'created_at',
            value: 'created_at',
          },
          {
            title: 'id',
            value: 'id',
          },
          {
            title: 'mid',
            value: 'mid',
          },
        ],
      },
    ],
    node3: [
      {
        title: 'video_id',
        value: 'video_id',
      },
    ],
  };
};
