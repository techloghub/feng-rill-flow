import { defineStore } from 'pinia';
import { computed, ref } from 'vue';
import { Graph } from '@antv/x6';

import { convertSchemaToTreeData } from '@/components/Dag/src/common/outputToTree';
import { GraphNodeReferenceUpdateParam } from '@/components/Dag/src/models/global';
import { TemplateNodeParamType } from '@/components/Dag/src/common/enums';
import { itemProps } from '@/components/Menu/src/props';

export const useProvideGraph = defineStore('graph', () => {
  const graphRef = ref<Graph>();
  const getGraphRef = computed(() => {
    console.log('getGraphRef', graphRef.value?.getNodes());
    return graphRef;
  });

  function setGraphRef(value) {
    graphRef.value = value;
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
    // 1. 获取依赖节点
    const references = getReferencesNodesByNodeId(nodeId);
    console.log('getReferences ', references);

    // 2. 根据依赖节点获取模版类型的节点
    const templateNodeIds = references?.filter((nodeId) => getNodeType(nodeId) === 'template');
    console.log('templateNodeIds ', templateNodeIds);

    // 3. 获取对应的output数据
    const outputs = templateNodeIds?.map((nodeId) => {
      const cell = graphRef.value?.getCellById(nodeId);
      console.log('getReferences foreach cell', cell);
      const nodePath = '$.' + cell?.data.tooltip;
      const treeData = convertSchemaToTreeData(cell?.data.nodeDetailSchema.output, nodePath);
      return { title: cell?.data.tooltip, value: nodePath, children: treeData };
    });
    console.log('getReferences output ', outputs);
    return outputs;
  }

  function getNodeOutput(nodeId) {
    const cell = graphRef.value?.getCellById(nodeId);
    return convertSchemaToTreeData(cell?.data.nodeDetailSchema.output);
  }

  function updateTemplateNodeParams(params: GraphNodeReferenceUpdateParam[]) {
    // 遍历params参数，并通过nodeId获取到对应的cell,同时根据param中的type来给参数赋值
    params.forEach((param) => {
      const cell = graphRef.value?.getCellById(param.nodeId);
      if (cell) {
        if (param.type === TemplateNodeParamType.INPUT) {
          // 直接更新cell的data 转换成nodeDetailParams的inputMapping中对应的参数中
          // 这里需要注意，如果是数组类型，需要把数组转换成字符串
          const inputMappings = cell.getData().nodeDetailParams.inputMappings;
          let cotainInputMapping = false;

          // 1.1 从inputMappings中找到target中的参数名，然后把source赋值
          for (const inputKey in inputMappings) {
            const inputTargetParam = inputMappings[inputKey].target.split('$.input.')[1];
            if (inputTargetParam === param.nodeParamKey) {
              inputMappings[inputKey].source = param.nodeParamValue;
              cotainInputMapping = true;
              break;
            }
          }

          // 1.2 如果不存在，则新增一个inputMapping
          if (!cotainInputMapping) {
            inputMappings.push({
              source: param.nodeParamValue,
              target: '$.input.' + param.nodeParamKey,
            });
          }

          // 1.3 更新节点信息
          cell.setData({
            ...cell.getData(),
            nodeDetailParams: {
              ...cell.getData().nodeDetailParams,
              inputMappings: inputMappings,
            },
          });

          cell.prop('nodeDetailParams', {
            ...cell.getData().nodeDetailParams,
            inputMappings: inputMappings,
          });

          console.log('updateTemplateNodeParams', cell.getData());
        } else if (param.type === TemplateNodeParamType.REFERENCE) {
          // 1.1 更新操作节点: 从inputMappings中找到target中的参数名，然后把source赋值
          const inputMappings = cell.getData().nodeDetailParams.inputMappings;
          let cotainInputMapping = false;
          const oriSourceValue = param.nodeParamValue.replace('$', '$.context');
          const oriTargetValue = '$.input.' + param.nodeParamKey;
          for (const inputKey in inputMappings) {
            if (inputMappings[inputKey].target === oriTargetValue) {
              inputMappings[inputKey].source = oriSourceValue;
              cotainInputMapping = true;
              break;
            }
          }
          // 1.2 如果不存在，则新增一个inputMapping
          if (!cotainInputMapping) {
            inputMappings.push({ source: oriSourceValue, target: oriTargetValue });
          }

          // 1.3 更新节点信息
          cell.setData({
            ...cell.getData(),
            nodeDetailParams: {
              ...cell.getData().nodeDetailParams,
              inputMappings: inputMappings,
            },
          });

          cell.prop('nodeDetailParams', {
            ...cell.getData().nodeDetailParams,
            inputMappings: inputMappings,
          });

          // 2.1 更新引用节点: 获取根据引用节点名称获取引用节点，
          const referenceNodeName = param.nodeParamValue.split('.')[1];
          // 从graph中根据data中的tooltip找到与referenceNode相同的node节点
          const referenceNode = graphRef.value?.getNodes().filter((node) => {
            return node.data.tooltip === referenceNodeName;
          })[0];
          // 根据referenceNode获取outputMappings，并将source为param.nodeParamValue的source替换为referenceNodeOutputMappings中的source
          const referenceNodeOutputMappings =
            referenceNode?.getData().nodeDetailParams.outputMappings;
          let refSourceValue = param.nodeParamValue.replace(referenceNodeName, 'output');
          const refTargetValue = refSourceValue.replace('output', 'context');
          let cotainOutputMapping = false;
          for (const outputKey in referenceNodeOutputMappings) {
            // TODO 测试代码 待删除
            // if (outputKey === '0') {
            //   refSourceValue = '$.output.result';
            // }
            console.log(
              'updateTemplateNodeParams',
              outputKey,
              param.nodeParamValue.replace(referenceNodeName, 'output'),
              referenceNodeOutputMappings[outputKey],
            );
            if (referenceNodeOutputMappings[outputKey].source === refSourceValue) {
              referenceNodeOutputMappings[outputKey].target = refTargetValue;
              cotainOutputMapping = true;
              break;
            }
          }

          // 2.2 如果没有找到，则新增outputmappings
          if (!cotainOutputMapping) {
            referenceNodeOutputMappings.push({
              source: refSourceValue,
              target: refTargetValue,
            });
          }

          // 2.3 更新依赖节点的数据
          if (referenceNode === undefined) {
            return;
          }
          referenceNode.setData({
            ...referenceNode.getData(),
            nodeDetailParams: {
              ...referenceNode.getData().nodeDetailParams,
              outputMappings: referenceNodeOutputMappings,
            },
          });
          referenceNode.prop('nodeDetailParams', {
            ...referenceNode.getData().nodeDetailParams,
            outputMappings: referenceNodeOutputMappings,
          });

          console.log(
            'updateTemplateNodeParams',
            param.nodeParamValue.split('.')[1],
            cell.getData(),
            referenceNode.getData(),
            referenceNodeOutputMappings,
          );
        }
      }
    });
    //更新节点信息
    // graphRef.value?.getCellById();
  }

  function getNodeType(nodeId) {
    const cell = graphRef.value?.getCellById(nodeId);
    console.log('getNodeType', cell?.data.nodeDetailSchema.node_type);
    return cell?.data.nodeDetailSchema.node_type;
  }
  return {
    graphRef,
    setGraphRef,
    getGraphRef,
    getReferences,
    getNodeOutput,
    updateTemplateNodeParams,
  };
});
