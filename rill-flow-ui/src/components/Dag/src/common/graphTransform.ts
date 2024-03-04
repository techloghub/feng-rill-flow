import yaml from 'js-yaml';
import {DagMetaInfo} from "@/components/Dag/src/models/global";

export function transferDagJson(graph, dagMeta: DagMetaInfo) {
  const newDagDetail = {
    version: dagMeta?.version,
    type: dagMeta?.type,
    workspace: dagMeta?.workspace,
    dagName: dagMeta?.dagName,
    alias: dagMeta?.alias,
    inputSchema: dagMeta?.inputSchema,
  };
  // 从graph转成json
  // 节点 next
  const cellsDetail = graph.getCells();
  const edgeMap = {};
  const nodeToIdMap = {};
  const idToNodeMap = {};
  const tasks = [];
  const tasksMap = {};
  for (const cell in cellsDetail) {
    const shape = cellsDetail[cell].store.data.shape;
    if (shape === 'vue-shape') {
      // 获取节点label->id的map
      nodeToIdMap[cellsDetail[cell].store.data.label] = cellsDetail[cell].store.data.id;
      idToNodeMap[cellsDetail[cell].store.data.id] = cellsDetail[cell].store.data.label;

      // 构建提交节点json
      if (cellsDetail[cell].store.data.nodeDetailSchema.node_type === 'template') {
        const detail = cellsDetail[cell].store.data.nodeDetailParams;
        // detail.parameters = cellsDetail[cell].store.data.nodeDetailParams.parameters;
        detail.name = cellsDetail[cell].store.data.label;
        detail.id = cellsDetail[cell].store.data.nodeDetailSchema.id;
        tasksMap[cellsDetail[cell].store.data.label] = detail;
      } else {
        tasksMap[cellsDetail[cell].store.data.label] =
          cellsDetail[cell].store.data.nodeDetailParams;
      }
    } else if (shape === 'edge') {
      // 获取source id -> target ids列表
      if (edgeMap[cellsDetail[cell].store.data.source.cell]) {
        edgeMap[cellsDetail[cell].store.data.source.cell].push(
          cellsDetail[cell].store.data.target.cell,
        );
      } else {
        edgeMap[cellsDetail[cell].store.data.source.cell] = [
          cellsDetail[cell].store.data.target.cell,
        ];
      }
    }
  }

  for (const nodeMapKey in nodeToIdMap) {
    const targets = edgeMap[nodeToIdMap[nodeMapKey]];
    let nextValue = '';
    for (const targetsKey in targets) {
      if (idToNodeMap[targets[targetsKey]] != '') {
        nextValue += idToNodeMap[targets[targetsKey]] + ',';
      }
    }
    if (nextValue !== '') {
      tasksMap[nodeMapKey]['next'] = nextValue;
    }
  }

  for (const tasksMapKey in tasksMap) {
    tasks.push(tasksMap[tasksMapKey]);
  }

  newDagDetail['tasks'] = tasks;
  return newDagDetail;
}

export function transferDagYaml(graph, dagMeta: DagMetaInfo) {
  const newDagDetail = transferDagJson(graph, dagMeta);
  return yaml.dump(newDagDetail);
}

export function transferJsonYaml(json) {
  return yaml.dump(json);
}

export function getNodeReferences(graph, nodeName) {
  const newDagDetail = transferDagJson(graph);
  const nodeMap = {};
  for (const task of newDagDetail['tasks']) {
    console.log('transferDagToNodeMap', task.name, task.next, nodeName);

    // 获取某个所有node直接以来的node列表。from节点指向to节点，那么map存的是to节点和依赖的所有from节点列表
    if (task.next) {
      for (const next of task.next.split(',').filter((item) => item !== '')) {
        if (nodeMap[next]) {
          nodeMap[next].push(task.name);
        } else {
          nodeMap[next] = [task.name];
        }
      }
    }
  }

  // 根据nodeName获取依赖的所有节点列表
  let nextNode = nodeMap[nodeName];
  while (nextNode) {
    for (const next of nextNode) {
      if (nodeMap[next]) {
        nodeMap[nodeName].push(next);
      }
    }
    nextNode = nodeMap[nextNode];
  }

  // 去重
  for (const key in nodeMap) {
    nodeMap[key] = [...new Set(nodeMap[key])];
  }

  console.log('transferDagToNodeMap', nodeMap);
  return nodeMap;
}
