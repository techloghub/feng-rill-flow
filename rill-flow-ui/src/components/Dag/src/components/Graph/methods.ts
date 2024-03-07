import yaml from 'js-yaml';

export const getJsonSchema = (rule) => {
  console.log('rule:', rule, rule.data);

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
    const fields = rule.data.fields;
    const result = {
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
    let fileterFileds = [];
    // TODO 需要将required_group实现切换
    if (fields.required_group != undefined) {
      fileterFileds = rule.data.fields.required_group[0];
    }
    for (const optionsKey in fields) {
      if (fileterFileds.length > 0 && !fileterFileds.includes(optionsKey)) {
        continue;
      }
      let fieldSchema = {};
      if (fields[optionsKey].type === 'string') {
        fieldSchema = {
          type: 'string',
          title: fields[optionsKey].name,
          required: fields[optionsKey].required,
          'x-decorator': 'FormItem',
          'x-component': 'Input',
        };
        if (fields[optionsKey].options != undefined) {
          fieldSchema['x-component'] = 'Select';
          fieldSchema['enum'] = fields[optionsKey].options;
          fieldSchema['x-component-props'] = {
            style: {
              width: '100px',
            },
          };
        }
      } else if (fields[optionsKey].type === 'number') {
        fieldSchema = {
          type: 'number',
          title: fields[optionsKey].name,
          'x-decorator': 'FormItem',
          'x-component': 'InputNumber',
          required: fields[optionsKey].required,
          'x-component-props': {
            style: {
              width: '240px',
            },
          },
        };
      } else if (fields[optionsKey].type === 'boolean') {
        fieldSchema = {
          type: 'boolean',
          title: fields[optionsKey].name,
          'x-decorator': 'FormItem',
          'x-component': 'Switch',
          required: fields[optionsKey].required,
          'x-component-props': {
            style: {
              // width: '240px',
            },
          },
        };
      }
      result.items.properties.space.properties[optionsKey] = fieldSchema;
    }
    result.items.properties.space.properties['remove'] = {
      type: 'void',
      'x-decorator': 'FormItem',
      'x-component': 'ArrayItems.Remove',
    };
    console.log('getJsonSchema result', result);
    return result;
  }

  if (rule.data && rule.data.type === 'string') {
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

export const getJsonFromYaml = (data) => {
  return yaml.load(data);
};

export const getMapByJson = (data) => {
  // data是一个map，该map的key为string类型，value是map类型。data可以理解为一个树。将其转换成key为非叶子节点以.间隔，value为叶子节点
  const map = {};

  function addToMap(obj, prefix = '') {
    for (const key in obj) {
      if (typeof obj[key] === 'object' && obj[key] !== null) {
        addToMap(obj[key], prefix + key + '.');
      } else {
        map[prefix + key] = obj[key];
      }
    }
  }
  addToMap(data);
  return map;
};

export const getJsonPathByJsonSchema = (data) => {
  // data是一个map，该map的key为string类型，value是map类型。data可以理解为一个树。将其转换成key为非叶子节点以.间隔，value为叶子节点
  const list = [];

  function isBaseType(type) {
    return type === 'string' || type === 'boolean' || type === 'number';
  }
  function addToList(obj, prefix = '') {
    if (typeof obj === 'object') {
      if (isBaseType(obj?.type)) {
        // 去重并加入到list中
        if (!list.includes(prefix.slice(0, -1))) {
          list.push(prefix.slice(0, -1));
        }
        return;
      }

      if (obj?.type === 'array') {
        addToList(obj.items.properties, prefix + '*.');
        return;
      }

      if (obj?.properties) {
        for (const key in obj?.properties) {
          addToList(obj.properties[key], prefix + key + '.');
        }
        return;
      }

      for (const key in obj) {
        addToList(obj[key], prefix + key + '.');
      }
    } else {
    }
  }
  addToList(data);
  return list;
}

export const getJsonByJsonPaths = (paths) => {
  const result = {};
  for (var i = 0; i < paths.length; i++) {
    var item = paths[i];
    var keys = item.key.split('.');
    var current = result;

    for (var j = 0; j < keys.length - 1; j++) {
      var key = keys[j];
      if (!current[key]) {
        current[key] = {};
      }
      current = current[key];
    }

    var lastKey = keys[keys.length - 1];
    current[lastKey] = item.value;
  }
  return result;
}
