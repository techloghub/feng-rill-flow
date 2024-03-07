function getJsonPathByJsonSchema(data) {
  // data是一个map，该map的key为string类型，value是map类型。data可以理解为一个树。将其转换成key为非叶子节点以.间隔，value为叶子节点
  const list = [];

  function isBaseType(type) {
    return type === 'string' || type === 'boolean' || type === 'number';
  }
  function addToList(obj, prefix = '') {
    if (typeof obj === 'object') {
      if (isBaseType(obj?.type)) {
        // 去重并加入到list中
        console.log('getMapByJson2 叶子节点 str', obj, prefix.slice(0, -1));
        if (!list.includes(prefix.slice(0, -1))) {
          list.push(prefix.slice(0, -1));
        }
        return;
      }

      if (obj?.type === 'array') {
        console.log('getMapByJson2 非叶子节点 array', prefix, obj, prefix + '*.');
        addToList(obj.items.properties, prefix + '*.');
        return;
      }

      if (obj?.properties) {
        for (const key in obj?.properties) {
          console.log(
            'getMapByJson2 非叶子节点 object properties ',
            obj.properties[key],
            prefix + key + '.',
          );
          addToList(obj.properties[key], prefix + key + '.');
        }
        return;
      }

      for (const key in obj) {
        console.log('getMapByJson2 非叶子节点 normal object', obj[key], prefix + key + '.');
        addToList(obj[key], prefix + key + '.');
      }
    } else {
      console.log('getMapByJson2 叶子节点内部 应该跳过', obj);
    }
  }
  addToList(data);
  console.log('getMapByJson2 map', data, list);
  return list;
}
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

// console.log(getJsonPathByJsonSchema(schema.properties));
// console.log('=============\n\n');
// console.log(JSON.stringify(schema, null, 2));

function getJsonByJsonPaths(paths) {
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

console.log('=============');
const paths = [
  { key: 'query.access_token', value: 123 },
  { key: 'query.ids', value: 345 },
];
console.log(JSON.stringify(getJsonByJsonPaths(paths), null, 2));
