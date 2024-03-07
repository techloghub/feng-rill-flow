function buildSchemaProperties(typeData, reference1) {
  const result = {
    attr: {
      title: '类型',
      type: 'string',
      enum: ['input', 'reference'],
      enumNames: ['input', 'reference'],
      'ui:width': '40%',
    },
    input: {
      title: '文本',
      type: typeData,
      'ui:hidden': "{{parentFormData.attr !== 'input'}}",
      'ui:width': '60%',
    },
    reference: {
      title: 'reference',
      type: 'string',
      default: '',
      'ui:hidden': "{{parentFormData.attr !== 'reference'}}",
      'ui:width': '60%',
      'ui:widget': 'SelectByTypeWidget',
      'ui:treeData': reference1,
    },
  };
  console.log('buildSchemaProperties', JSON.stringify(result));
  return result;
}

function isBaseType(type) {
  return type === 'string' || type === 'boolean' || type === 'number';
}
function replaceUIWidget(json, reference1) {
  if (typeof json === 'object') {
    if (isBaseType(json?.type)) {
      // 进行替换操作
      json['properties'] = buildSchemaProperties(json?.type, reference1);
      console.log('base type replace', json?.type, JSON.stringify(json['properties']));
      delete json['type'];
      console.log('base type replace after', json?.type, JSON.stringify(json['properties']));
      return;
    }
    for (const jsonKey in json) {
      replaceUIWidget(json[jsonKey], reference1);
    }
  } else if (Array.isArray(json)) {
    json.forEach((element) => {
      replaceUIWidget(element, reference1);
    });
  }
}

const data1 = {
  type: 'object',
  required: ['appkey'],
  properties: {
    appkey: {
      title: 'appkey',
      properties: {
        attr: {
          title: '类型',
          type: 'string',
          enum: ['input', 'reference'],
          enumNames: ['input', 'reference'],
          'ui:width': '40%',
        },
        input: {
          title: '文本',
          type: 'string',
          'ui:hidden': "{{parentFormData.attr !== 'input'}}",
          'ui:width': '60%',
        },
        reference: {
          title: 'reference',
          type: 'string',
          default: '',
          'ui:hidden': "{{parentFormData.attr !== 'reference'}}",
          'ui:width': '60%',
          'ui:widget': 'SelectByTypeWidget',
          'ui:treeData': [],
        },
      },
    },
  },
};

const schema = {
  type: 'object',
  required: ['query.access_token'],
  properties: {
    query: {
      title: 'query',
      type: 'object',
      properties: {
        access_token: {
          title: 'access_token',
          type: 'string',
        },
        ids: {
          title: 'mids',
          type: 'string',
        },
      },
    },
  },
};

const schema2 = {
  type: 'object',
  required: [],
  properties: {
    a: {
      title: 'Array',
      type: 'array',
      items: {
        type: 'object',
        required: [],
        properties: {
          b: {
            title: '输入框',
            type: 'string',
            'ui:options': {
              placeholder: '请输入',
            },
          },
        },
        'ui:order': ['string_1709705190937x0'],
      },
      uniqueItems: false,
    },
  },
  'ui:order': ['array_1709705188765x0'],
};

const reference = [
  {
    "title": "context",
    "value": "$",
    "children": [
      {
        "title": "mid【String】",
        "value": "$.mid"
      },
      {
        "title": "access_token【String】",
        "value": "$.access_token"
      }
    ]
  },
  {
    "title": "showBatch",
    "value": "$.showBatch",
    "children": [
      {
        "title": "statuses【array】",
        "value": "$.showBatch.statuses",
        "children": [
          {
            "title": "text【string】",
            "value": "$.showBatch.statuses.*.text",
            "children": []
          }
        ]
      }
    ]
  }
];
console.log(replaceUIWidget(schema, reference));
console.log(schema);
console.log(JSON.stringify(schema, null, 2));
