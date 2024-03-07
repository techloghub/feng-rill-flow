import { defineStore } from 'pinia';
import { computed, ref } from 'vue';
import { Graph } from '@antv/x6';

import {
  convertInputSchemaToTreeData,
  convertSchemaToTreeData,
} from '@/components/Dag/src/common/outputToTree';
import { DagMetaInfo, GraphNodeReferenceUpdateParam } from '@/components/Dag/src/models/global';
import { TemplateNodeParamType } from '@/components/Dag/src/common/enums';
import { Cell } from '@antv/x6/src/model/cell';

export const useProvideGraph = defineStore('graph', () => {
  const graphRef = ref<Graph>();
  const dagMeta = ref<DagMetaInfo>();
  const oldDagInfo = ref({});
  const getGraphRef = computed(() => {
    console.log('getGraphRef', graphRef.value?.getNodes());
    return graphRef;
  });

  function setGraphRef(value) {
    graphRef.value = value;
  }

  function setDagMeta(value: DagMetaInfo) {
    if (value === null || value === undefined) {
      return;
    }
    if (value.alias == undefined) {
      value.alias = 'release';
    }
    dagMeta.value = value;
  }

  function setOldDagInfo(value) {
    oldDagInfo.value = value;
  }

  function setDagMetaInputSchema(value) {
    console.log('setDagMetaInputSchema', dagMeta.value, dagMeta.value instanceof DagMetaInfo);
    dagMeta.value?.setInputSchema(value);
    console.log('setDagMetaInputSchema', dagMeta.value, dagMeta.value instanceof DagMetaInfo);
  }

  /**
   * 根据节点id获取该节点的所有依赖节点
   * @param nodeId
   * @param isSearchNode 是否为用户要查询的节点(true: 是用户要查询的节点，false: 不是用户要查询的节点,而是该节点的依赖节点)
   * @returns {string[]} 返回该节点的所有依赖节点id
   */
  function getReferencesNodesByNodeId(nodeId: string, isSearchNode = true): string[] | null {
    const nodes: string[] = [];

    if (nodeId == null) {
      return null;
    }

    const cell = graphRef.value?.getCellById(nodeId);
    if (cell == undefined) {
      return nodes;
    }
    // 1. 根据节点id获取该节点的所有incomingEdges
    const incomingEdges = graphRef.value?.getIncomingEdges(cell);
    if (incomingEdges != null && incomingEdges.length > 0) {
      // 2. 获取incomingEdges中每个元素的source节点，并将source节点id添加到一个列表中
      incomingEdges.forEach((edge) => {
        const referenceNodeIds = getReferencesNodesByNodeId(edge.getSourceCellId(), false);
        referenceNodeIds?.forEach((nodeId) => nodes.push(nodeId));
      });
    }
    // 3. 当节点为非查询节点时，将自身节点加到列表中
    if (!isSearchNode) {
      nodes.push(nodeId);
    }
    return nodes;
  }

  function getReferences(nodeId) {
    if (dagMeta.value === undefined) {
      return [];
    }
    // 1. 获取依赖节点
    const references = getReferencesNodesByNodeId(nodeId);
    console.log('getReferences ', references);

    // 2. 根据依赖节点获取模版类型的节点
    const templateNodeIds = references?.filter((nodeId) => getNodeType(nodeId) === 'template');
    console.log('templateNodeIds ', templateNodeIds, JSON.parse(dagMeta.value?.inputSchema));

    // 3. 获取对应的output数据(含inputSchema数据)
    const outputs = convertInputSchemaToTreeData(JSON.parse(dagMeta.value?.inputSchema));
    templateNodeIds?.forEach((nodeId) => {
      const cell = graphRef.value?.getCellById(nodeId);
      console.log('getReferences foreach cell', cell?.data.nodeDetailSchema.output);
      const nodePath = '$.' + cell?.data.tooltip;
      const output =
        typeof cell?.data.nodeDetailSchema.output === 'string'
          ? JSON.parse(cell?.data.nodeDetailSchema.output)
          : cell?.data.nodeDetailSchema.output;
      const treeData = convertSchemaToTreeData(output, nodePath);
      outputs.push({ title: cell?.data.tooltip, value: nodePath, children: treeData });
    });
    console.log('getReferences output ', outputs);
    return outputs;
  }

  function getNodeOutput(nodeId) {
    const cell = graphRef.value?.getCellById(nodeId);
    const output =
      typeof cell?.data.nodeDetailSchema.output === 'string'
        ? JSON.parse(cell?.data.nodeDetailSchema.output)
        : cell?.data.nodeDetailSchema.output;
    return convertSchemaToTreeData(output);
  }

  function exposeRefOutput(nodeDetailParams, outputPath: string) {
    const taskName = nodeDetailParams.name;
    const outputMap = {
      source: '$.output.' + outputPath,
      // target: '$.context.' + taskName,
      target: '$.context.' + taskName + '.' + outputPath,
    };
    if(nodeDetailParams.outputMappings == undefined) {
      nodeDetailParams.outputMappings = [];
    }

    addMappings(nodeDetailParams.outputMappings, outputMap,'source');
    return outputMap;
  }
  function addMappings(mappings:{}[], newMapping: {},field: string) {
    for(const index in mappings) {
      if (mappings[index][field] == newMapping[field]) {
        mappings[index] = newMapping;
        return;
      }
    }
    mappings.push(newMapping);
  }

  function importFromContext(nodeDetailParams, inputPath, context) {

    const inputMap =  {
      source: context,
      target: '$.input.' + inputPath,
    };
   if(nodeDetailParams.inputMappings == undefined) {
      nodeDetailParams.inputMappings = [];
   }

    addMappings(nodeDetailParams.inputMappings, inputMap,'target');
  }

  function makeReference(targetNode, targetPath, refNode, refPath) {
    const outputMapping = exposeRefOutput(refNode, refPath);
    importFromContext(targetNode, targetPath, outputMapping?.target);
  }

  function updateTemplateNodeParams(params: GraphNodeReferenceUpdateParam[]) {
    // 遍历params参数，并通过nodeId获取到对应的cell,同时根据param中的type来给参数赋值
    params.forEach((param) => {
      const cell = graphRef.value?.getCellById(param.nodeId);
      if (cell) {
        const targetNodeParams = cell.getData().nodeDetailParams;
        if (param.type === TemplateNodeParamType.INPUT) {
          importFromContext(targetNodeParams, param.nodeParamKey, param.nodeParamValue);
          cell.prop('nodeDetailParams', {
            ...cell.getData().nodeDetailParams,
            inputMappings: targetNodeParams.inputMappings,
          });

          console.log('updateTemplateNodeParams', param.nodeParamKey, cell.getData());
        } else if (param.type === TemplateNodeParamType.REFERENCE) {
          console.log('updateTemplateNodeParams reference ', param.nodeParamKey, param.nodeParamValue);
          const refParts = param.nodeParamValue.split('.');
          const refNodeName = refParts[1];
          if (refNodeName === 'context') {
            importFromContext(targetNodeParams, param.nodeParamKey, param.nodeParamValue);
            cell.prop('nodeDetailParams', {
              ...cell.getData().nodeDetailParams,
              inputMappings: targetNodeParams.inputMappings,
            });
            return;
          }
          const refPath = refParts.slice(2).join('.');
          const refNode = graphRef.value?.getNodes().filter((node) => {
            return node.data.tooltip === refNodeName;
          })[0];
          const refNodeParams = refNode.getData().nodeDetailParams;
          makeReference(targetNodeParams, param.nodeParamKey, refNodeParams, refPath);

          cell.prop('nodeDetailParams', {
            ...cell.getData().nodeDetailParams,
            inputMappings: targetNodeParams.inputMappings,
          });
          refNode.prop('nodeDetailParams', {
            ...refNode.getData().nodeDetailParams,
            outputMappings: refNodeParams.outputMappings,
          });
          console.log('1updateTemplateNodeParams finish', cell.getData(), refNode?.getData());
        }
      }
    });
  }

  function getNodeType(nodeId) {
    const cell = graphRef.value?.getCellById(nodeId);
    console.log('getNodeType', cell?.data.nodeDetailSchema.node_type);
    return cell?.data.nodeDetailSchema.node_type;
  }

  function getNodeInputSchema(nodeId) {
    const cell = graphRef.value?.getCellById(nodeId);
    // 1. 获取node对应的inputSchema
    // 2. 将inputSchema中类型为 string,number,boolean字段替换成【系统本身的ui:widget结构】。
    // 3. 替换指定字段的ui:treeData

    return cell?.data.nodeDetailSchema.inputs;
  }

  function containTask(taskName) {
    return graphRef.value?.getNodes().map((node) => {
      console.log("初始化基础参数的具体值 是否为node 查询", node.getAttrs().label.text, node.getAttrs());
      return node.getAttrs().label.text;
    }).includes(taskName);
  }

  function clearGraph() {
    dagMeta.value = {};
  }
  return {
    dagMeta,
    graphRef,
    oldDagInfo,
    setGraphRef,
    getGraphRef,
    getReferences,
    getNodeOutput,
    updateTemplateNodeParams,
    setDagMeta,
    setDagMetaInputSchema,
    setOldDagInfo,
    getNodeInputSchema,
    containTask,
    clearGraph,
  };
});
