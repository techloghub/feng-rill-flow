import { customWidgets } from '@/components/Dag/src/components/NodesBar/data';

export function replaceUIWidget(json) {
  // 检查是否为对象类型
  if (typeof json === 'object') {
    // 遍历对象的每个属性
    for (const key in json) {
      if (json.hasOwnProperty(key)) {
        // 如果属性的键为 "ui:widget"，则将其值替换为 "aaa"
        if (key === 'ui:widget') {
          json[key] = customWidgets()[json[key]];
        }
        // 递归处理属性的值
        replaceUIWidget(json[key]);
      }
    }
  } else if (Array.isArray(json)) {
    // 如果是数组类型，则递归处理数组中的每个元素
    json.forEach((element) => {
      replaceUIWidget(element);
    });
  }
}
export function replaceUItreeData(json, treeData) {
  // 检查是否为对象类型
  if (typeof json === 'object') {
    // 遍历对象的每个属性
    for (const key in json) {
      if (json.hasOwnProperty(key)) {
        // 如果属性的键为 "ui:widget"，则将其值替换为 "aaa"
        if (key === 'ui:treeData') {
          json[key] = treeData;
        }
        // 递归处理属性的值
        replaceUItreeData(json[key], treeData);
      }
    }
  } else if (Array.isArray(json)) {
    // 如果是数组类型，则递归处理数组中的每个元素
    json.forEach((element) => {
      replaceUItreeData(element, treeData);
    });
  }
}

// 示例 JSON 对象
const json = {
  type: 'object',
  required: ['name', 'appkey'],
  properties: {
    name: {
      type: 'string',
      title: '节点名称',
      default: '',
    },
    appkey: {
      title: 'appkey',
      properties: {
        attr: {
          title: '类型',
          type: 'string',
          enum: ['input', 'reference'],
          enumNames: ['input', 'reference'],
          'ui:width': '30%',
        },
        input: {
          title: '文本',
          type: 'string',
          'ui:hidden': "{{parentFormData.attr !== 'input'}}",
          'ui:width': '40%',
        },
        reference: {
          title: 'reference',
          type: 'string',
          default: 's',
          'ui:hidden': "{{parentFormData.attr !== 'reference'}}",
          'ui:width': '40%',
          'ui:widget': 'SelectByTypeWidget',
          'ui:treeData': [
            {
              title: 'parent11111',
              value: 'parent1',
              children: [
                {
                  title: 'parent 1-0',
                  value: 'parent 1-0',
                  children: [
                    { title: 'my leaf', value: 'leaf1' },
                    { title: 'your leaf', value: 'leaf2' },
                  ],
                },
                { title: 'parent 1-1', value: 'parent 1-1' },
              ],
            },
          ],
        },
      },
    },
  },
};

replaceUIWidget(json);

console.log(json);
