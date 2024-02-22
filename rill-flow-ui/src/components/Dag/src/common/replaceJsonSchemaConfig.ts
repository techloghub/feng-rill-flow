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
