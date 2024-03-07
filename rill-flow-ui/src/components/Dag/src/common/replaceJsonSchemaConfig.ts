import { customWidgets } from '@/components/Dag/src/components/NodesBar/data';

// export function replaceUIWidget(json) {
//   // 检查是否为对象类型
//   if (typeof json === 'object') {
//     // 遍历对象的每个属性
//     for (const key in json) {
//       if (json.hasOwnProperty(key)) {
//         // 如果属性的键为 "ui:widget"，则将其值替换为 "aaa"
//         if (key === 'ui:widget') {
//           json[key] = customWidgets()[json[key]];
//         }
//         // 递归处理属性的值
//         replaceUIWidget(json[key]);
//       }
//     }
//   } else if (Array.isArray(json)) {
//     // 如果是数组类型，则递归处理数组中的每个元素
//     json.forEach((element) => {
//       replaceUIWidget(element);
//     });
//   }
// }
// export function replaceUItreeData(json, treeData) {
//   // 检查是否为对象类型
//   if (typeof json === 'object') {
//     // 遍历对象的每个属性
//     for (const key in json) {
//       if (json.hasOwnProperty(key)) {
//         // 如果属性的键为 "ui:widget"，则将其值替换为 "aaa"
//         if (key === 'ui:treeData') {
//           json[key] = treeData;
//         }
//         // 递归处理属性的值
//         replaceUItreeData(json[key], treeData);
//       }
//     }
//   } else if (Array.isArray(json)) {
//     // 如果是数组类型，则递归处理数组中的每个元素
//     json.forEach((element) => {
//       replaceUItreeData(element, treeData);
//     });
//   }
// }

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
      'ui:widget': customWidgets()['SelectByTypeWidget'],
      'ui:treeData': reference1,
    },
  };
  console.log('buildSchemaProperties', JSON.stringify(result));
  return result;
}

function isBaseType(type) {
  return type === 'string' || type === 'boolean' || type === 'number';
}
export function replaceUIWidget(json, reference1) {
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
